import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const childId = searchParams.get('childId');
    const type = searchParams.get('type'); // 'weekly' or 'monthly'
    const week = searchParams.get('week');
    const month = searchParams.get('month');

    if (type === 'weekly' && childId && week) {
      const report = await db.weeklyReport.findFirst({
        where: {
          childProfileId: childId,
          weekNumber: parseInt(week),
        },
      });
      return NextResponse.json(report);
    }

    if (type === 'monthly' && childId && month) {
      const report = await db.monthlyReport.findFirst({
        where: {
          childProfileId: childId,
          monthNumber: parseInt(month),
        },
      });
      return NextResponse.json(report);
    }

    if (childId) {
      const weeklyReports = await db.weeklyReport.findMany({
        where: { childProfileId: childId },
        orderBy: { weekNumber: 'desc' },
        take: 4,
      });
      const monthlyReports = await db.monthlyReport.findMany({
        where: { childProfileId: childId },
        orderBy: [{ year: 'desc' }, { monthNumber: 'desc' }],
        take: 3,
      });
      return NextResponse.json({ weeklyReports, monthlyReports });
    }

    // Get all children's latest reports for parent dashboard
    const children = await db.childProfile.findMany({
      include: {
        weeklyReports: { orderBy: { weekNumber: 'desc' }, take: 1 },
        monthlyReports: { orderBy: [{ year: 'desc' }, { monthNumber: 'desc' }], take: 1 },
        user: true,
      },
    });

    return NextResponse.json(children);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childProfileId, type, weekNumber, monthNumber, year } = body;

    // Get child data for report generation
    const child = await db.childProfile.findUnique({
      where: { id: childProfileId },
      include: {
        user: true,
        missionAssignments: {
          include: { weeklyMission: true, submissions: true },
          orderBy: { assignedDate: 'desc' },
          take: weekNumber ? 1 : 4,
        },
        inventionJournals: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        skillProgress: {
          include: { skill: true },
        },
        performanceSnapshots: {
          orderBy: { createdAt: 'desc' },
          take: 4,
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Generate report content
    const recentMissions = child.missionAssignments.filter((a) => a.status === 'completed');
    const currentMission = child.missionAssignments[0];
    const inventions = child.inventionJournals;

    if (type === 'weekly') {
      const reportText = generateWeeklyReport(child, currentMission, inventions);

      const report = await db.weeklyReport.create({
        data: {
          childProfileId,
          weekNumber,
          reportText,
          highlights: JSON.stringify({
            missionCompleted: currentMission?.status === 'completed',
            newInventions: inventions.filter((i) => i.weekNumber === weekNumber).length,
            pointsEarned: 25,
          }),
          skillGrowthSummary: JSON.stringify(
            child.skillProgress.map((sp) => ({
              skill: sp.skill.skillName,
              level: sp.currentLevel,
            }))
          ),
          suggestedConversationTopics: JSON.stringify([
            `Ask ${child.displayName} about their ${currentMission?.weeklyMission.missionTitle || 'latest project'}`,
            `What invention idea is ${child.displayName} most excited about?`,
            `How did ${child.displayName} solve challenges this week?`,
          ]),
          recommendedParentActions: JSON.stringify([
            'Celebrate their progress!',
            'Ask about their invention journal',
            'Encourage them to share their work',
          ]),
        },
      });

      return NextResponse.json(report);
    }

    if (type === 'monthly') {
      const reportText = generateMonthlyReport(child, recentMissions, inventions);

      const report = await db.monthlyReport.create({
        data: {
          childProfileId,
          monthNumber,
          year: year || new Date().getFullYear(),
          reportText,
          keyProjects: JSON.stringify(recentMissions.map((m) => m.weeklyMission.missionTitle)),
          inventionSummary: JSON.stringify(inventions.map((i) => ({ title: i.title, status: i.status }))),
          confidenceSummary: `${child.displayName} has shown great enthusiasm and creativity this month!`,
          collaborationSummary: 'Great teamwork during family innovation activities!',
          growthRecommendations: 'Continue encouraging creative exploration and documentation of ideas.',
        },
      });

      return NextResponse.json(report);
    }

    return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

function generateWeeklyReport(
  child: {
    displayName: string;
    age: number;
    totalPoints: number;
    streakDays: number;
    currentWeek: number;
    learningTrack: string;
  },
  currentMission: {
    status: string;
    weeklyMission: { missionTitle: string; missionSummary: string };
    completionPercentage: number;
  } | null,
  inventions: { title: string; status: string }[]
): string {
  return `
# Weekly Report for ${child.displayName}

**Week ${child.currentWeek}** | ${child.learningTrack === 'builder_inventor' ? 'Builder-Inventor Track' : 'Creative Inventor Track'}

## This Week's Mission
${currentMission?.weeklyMission.missionTitle || 'No active mission'}
${currentMission ? `Status: ${currentMission.status === 'completed' ? '✅ Completed!' : `${currentMission.completionPercentage}% Complete`}` : ''}

## Invention Journal
${inventions.length > 0 ? inventions.map((i) => `- ${i.title} (${i.status})`).join('\n') : 'No new inventions this week'}

## Progress
- 🔥 Streak: ${child.streakDays} days
- ⭐ Total Points: ${child.totalPoints}
- 📚 Current Week: ${child.currentWeek} of 52

## Suggestions for Parents
Ask ${child.displayName} about what they learned this week and what they're excited to work on next!
`;
}

function generateMonthlyReport(
  child: {
    displayName: string;
    age: number;
    totalPoints: number;
    currentWeek: number;
    learningTrack: string;
    skillProgress: { currentLevel: number; skill: { skillName: string } }[];
  },
  missions: { weeklyMission: { missionTitle: string } }[],
  inventions: { title: string; status: string }[]
): string {
  return `
# Monthly Report for ${child.displayName}

## Accomplishments This Month
- Completed ${missions.length} missions
- Created ${inventions.length} invention ideas
- Earned ${child.totalPoints} total points

## Skill Progress
${child.skillProgress.map((sp) => `- ${sp.skill.skillName}: Level ${sp.currentLevel}/5`).join('\n')}

## Invention Journal Highlights
${inventions.map((i) => `- **${i.title}** - ${i.status}`).join('\n') || 'No inventions logged yet'}

## Recommendations
Continue encouraging ${child.displayName}'s creativity and invention thinking. The skills being developed will last a lifetime!
`;
}
