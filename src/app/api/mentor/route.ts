import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Mentor personalities for different modes
const mentorPersonalities = {
  guide: `You are the Inventor Guide, a friendly AI mentor for children learning to invent and create. You are:
- Encouraging and supportive
- Curious and ask questions instead of giving direct answers
- Playful and use fun examples
- Patient and never critical
- Imaginative and inspire creativity

Always respond in a warm, friendly tone suitable for children ages 8-10. Use emojis occasionally to make responses fun. Keep responses concise but helpful.`,

  inventor_coach: `You are the Inventor Coach, helping children develop their invention ideas. You:
- Ask "What problem does this solve?"
- Help refine ideas with questions like "How could we make this even better?"
- Encourage documenting ideas in the invention journal
- Celebrate creativity and original thinking
- Use simple language children can understand

Guide them to think through their inventions step by step.`,

  entrepreneur_coach: `You are the Entrepreneurship Coach for young inventors. You help children understand:
- Who would use their invention
- What makes their invention valuable
- How to explain their idea to others
- Simple business thinking in kid-friendly ways

Ask questions like "Who would love to have your invention?" and "What makes your idea special?"`,

  ip_guide: `You are the IP Guide, teaching children about intellectual property in simple terms. You explain:
- Ideas vs Inventions (ideas are thoughts, inventions are documented ideas)
- Patents (like a certificate saying "I invented this first!")
- Copyright (protects things you create like stories and drawings)
- Trademarks (protects names and logos)

Use simple analogies and fun examples. Always encourage keeping good records in their invention journal.`,

  collaboration_coach: `You are the Collaboration Coach, helping siblings work together on inventions. You:
- Suggest roles based on each child's strengths
- Help them combine their ideas
- Encourage teamwork and sharing
- Make collaboration fun and rewarding
- Help resolve any disagreements positively

Celebrate when they work well together!`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childProfileId, message, mode = 'guide', sessionId } = body;

    // Get or create mentor session
    let session;
    if (sessionId) {
      session = await db.mentorSession.findUnique({
        where: { id: sessionId },
        include: { messages: { orderBy: { createdAt: 'asc' } } },
      });
    }

    if (!session) {
      session = await db.mentorSession.create({
        data: {
          childProfileId,
          mentorMode: mode,
        },
        include: { messages: true },
      });
    }

    // Get child profile for context
    const childProfile = await db.childProfile.findUnique({
      where: { id: childProfileId },
      include: {
        user: true,
        missionAssignments: {
          include: { weeklyMission: true },
          orderBy: { assignedDate: 'desc' },
          take: 1,
        },
        mentorMemory: {
          orderBy: { updatedAt: 'desc' },
          take: 5,
        },
      },
    });

    // Build context for the AI
    const childAge = childProfile?.age || 10;
    const currentMission = childProfile?.missionAssignments[0]?.weeklyMission;
    const memories = childProfile?.mentorMemory || [];

    // Build conversation history
    const conversationHistory = session.messages.map((msg) => ({
      role: msg.senderType === 'mentor' ? 'assistant' as const : 'user' as const,
      content: msg.messageText,
    }));

    // Save child's message
    await db.mentorMessage.create({
      data: {
        mentorSessionId: session.id,
        senderType: 'child',
        messageText: message,
      },
    });

    // Create OpenAI instance
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `${mentorPersonalities[mode as keyof typeof mentorPersonalities] || mentorPersonalities.guide}

Child's name: ${childProfile?.displayName || 'Young Inventor'}
Child's age: ${childAge}
Current mission: ${currentMission?.missionTitle || 'Starting their journey'}
Learning track: ${childProfile?.learningTrack === 'builder_inventor' ? 'Builder-Inventor (building apps and products)' : 'Creative Inventor (drawing, stories, and imagination)'}

${memories.length > 0 ? `Remember this about the child: ${memories.map(m => m.memoryValue).join(', ')}` : ''}

Respond in a way that's appropriate for a ${childAge}-year-old. Keep responses conversational and engaging.`;

    // Build messages array for OpenAI
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model, can change to 'gpt-4o' for better responses
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'I\'m here to help! What would you like to explore?';

    // Save mentor's response
    await db.mentorMessage.create({
      data: {
        mentorSessionId: session.id,
        senderType: 'mentor',
        messageText: aiResponse,
      },
    });

    // Update session mode if changed
    if (mode !== session.mentorMode) {
      await db.mentorSession.update({
        where: { id: session.id },
        data: { mentorMode: mode },
      });
    }

    return NextResponse.json({
      response: aiResponse,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Mentor API error:', error);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
