import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Starting database setup...');

    // Check if already set up by counting users
    const existingUsers = await db.user.count().catch(() => 0);
    if (existingUsers > 0) {
      return NextResponse.json({ 
        message: 'Database already set up', 
        setup: false 
      });
    }

    // Create parent user
    const parent = await db.user.create({
      data: {
        email: 'parent@inventorslab.com',
        fullName: 'Parent',
        password: 'inventor2024',
        role: 'parent',
        status: 'active',
      },
    });

    // Create child users
    const mesha = await db.user.create({
      data: {
        email: 'mesha@inventorslab.com',
        fullName: 'Mesha',
        role: 'child',
        status: 'active',
      },
    });

    const musiche = await db.user.create({
      data: {
        email: 'musiche@inventorslab.com',
        fullName: 'Musiche',
        role: 'child',
        status: 'active',
      },
    });

    // Create child profiles
    const meshaProfile = await db.childProfile.create({
      data: {
        userId: mesha.id,
        displayName: 'Mesha',
        age: 10,
        learningTrack: 'builder_inventor',
        interests: JSON.stringify(['coding', 'robots', 'science', 'games']),
        currentWeek: 1,
        difficultyLevel: 'beginner',
        streakDays: 0,
        totalPoints: 0,
      },
    });

    const musicheProfile = await db.childProfile.create({
      data: {
        userId: musiche.id,
        displayName: 'Musiche',
        age: 8,
        learningTrack: 'creative_inventor',
        interests: JSON.stringify(['drawing', 'stories', 'animals', 'magic']),
        currentWeek: 1,
        difficultyLevel: 'beginner',
        streakDays: 0,
        totalPoints: 0,
      },
    });

    // Create parent-child links
    await db.parentChildLink.createMany({
      data: [
        { parentUserId: parent.id, childUserId: mesha.id, permissionLevel: 'full' },
        { parentUserId: parent.id, childUserId: musiche.id, permissionLevel: 'full' },
      ],
    });

    // Create curricula
    const builderCurriculum = await db.curriculum.create({
      data: {
        title: 'Builder-Inventor Track',
        trackType: 'builder_inventor',
        description: 'Learn to build digital products and think like an inventor',
        totalWeeks: 52,
      },
    });

    const creativeCurriculum = await db.curriculum.create({
      data: {
        title: 'Creative Inventor Track',
        trackType: 'creative_inventor',
        description: 'Develop creativity and invention thinking through play',
        totalWeeks: 52,
      },
    });

    // Create phases
    const phases = [
      { builder: 'Creator Foundations', creative: 'AI Creativity Lab' },
      { builder: 'Product Thinking', creative: 'Inventor Play' },
      { builder: 'Inventor Thinking', creative: 'Story Worlds' },
      { builder: 'Mini Startup Projects', creative: 'Product Imagination' },
      { builder: 'Product Launch', creative: 'Creator Showcase' },
    ];

    const builderPhases = await Promise.all(
      phases.map((names, i) =>
        db.curriculumPhase.create({
          data: {
            curriculumId: builderCurriculum.id,
            phaseNumber: i + 1,
            phaseTitle: names.builder,
            phaseDescription: `Phase ${i + 1} of Builder-Inventor Track`,
            weekStart: i * 8 + 1,
            weekEnd: Math.min((i + 1) * 8, 52),
            goals: JSON.stringify([]),
          },
        })
      )
    );

    const creativePhases = await Promise.all(
      phases.map((names, i) =>
        db.curriculumPhase.create({
          data: {
            curriculumId: creativeCurriculum.id,
            phaseNumber: i + 1,
            phaseTitle: names.creative,
            phaseDescription: `Phase ${i + 1} of Creative Inventor Track`,
            weekStart: i * 8 + 1,
            weekEnd: Math.min((i + 1) * 8, 52),
            goals: JSON.stringify([]),
          },
        })
      )
    );

    // Create first missions
    const builderMission1 = await db.weeklyMission.create({
      data: {
        curriculumId: builderCurriculum.id,
        phaseId: builderPhases[0].id,
        weekNumber: 1,
        missionTitle: 'Create a Story Generator',
        missionType: 'build',
        missionSummary: 'Build a simple AI-powered story generator that creates fun short stories',
        coreObjective: 'Learn basic AI prompting and app structure',
        estimatedHours: 4,
        entrepreneurshipFocus: 'Who would enjoy your story generator?',
      },
    });

    const creativeMission1 = await db.weeklyMission.create({
      data: {
        curriculumId: creativeCurriculum.id,
        phaseId: creativePhases[0].id,
        weekNumber: 1,
        missionTitle: 'Create Your First Cartoon Character',
        missionType: 'creative',
        missionSummary: 'Draw and describe a fun cartoon character using AI help',
        coreObjective: 'Learn character creation',
        estimatedHours: 2,
      },
    });

    // Assign first missions
    await db.childMissionAssignment.create({
      data: {
        childProfileId: meshaProfile.id,
        weeklyMissionId: builderMission1.id,
        status: 'assigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    await db.childMissionAssignment.create({
      data: {
        childProfileId: musicheProfile.id,
        weeklyMissionId: creativeMission1.id,
        status: 'assigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Create badges
    await db.badge.createMany({
      data: [
        { name: 'First Idea', description: 'Created your first invention idea', category: 'invention', pointsValue: 10 },
        { name: 'Creative Spark', description: 'Showed amazing creativity', category: 'creativity', pointsValue: 15 },
        { name: 'Team Player', description: 'Worked great with your sibling', category: 'collaboration', pointsValue: 20 },
        { name: 'Young Entrepreneur', description: 'Had a great business idea', category: 'entrepreneurship', pointsValue: 25 },
        { name: 'Week Champion', description: 'Completed a week of missions', category: 'milestone', pointsValue: 15 },
      ],
    });

    // Create app state
    await db.appState.create({
      data: {
        key: 'initialized',
        value: 'true',
      },
    });

    console.log('Database setup complete!');

    return NextResponse.json({ 
      success: true,
      message: 'Database initialized successfully!', 
      loginCodes: {
        parent: { email: 'parent@inventorslab.com', password: 'inventor2024' },
        mesha: { code: 'MESHA2024' },
        musiche: { code: 'MUSICHE2024' },
      }
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Setup failed', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if database is set up
    const userCount = await db.user.count().catch(() => 0);
    const childCount = await db.childProfile.count().catch(() => 0);
    const missionCount = await db.weeklyMission.count().catch(() => 0);
    
    return NextResponse.json({
      initialized: userCount > 0,
      stats: {
        users: userCount,
        children: childCount,
        missions: missionCount,
      }
    });
  } catch (error) {
    return NextResponse.json({
      initialized: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
