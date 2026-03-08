import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const childId = searchParams.get('childId');
    const week = searchParams.get('week');

    if (!childId) {
      return NextResponse.json({ error: 'Child ID required' }, { status: 400 });
    }

    const child = await db.childProfile.findUnique({
      where: { id: childId },
      include: {
        missionAssignments: {
          include: {
            weeklyMission: {
              include: { phase: true },
            },
            submissions: true,
          },
          orderBy: { assignedDate: 'desc' },
        },
      },
    });

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    // Get current week's mission
    const currentAssignment = child.missionAssignments[0];

    // Get all missions for the curriculum
    const curriculum = await db.curriculum.findFirst({
      where: { trackType: child.learningTrack },
      include: {
        phases: true,
        missions: {
          orderBy: { weekNumber: 'asc' },
        },
      },
    });

    return NextResponse.json({
      child,
      currentAssignment,
      curriculum,
      completedWeeks: child.missionAssignments
        .filter((a) => a.status === 'completed')
        .map((a) => a.weeklyMission.weekNumber),
    });
  } catch (error) {
    console.error('Error fetching missions:', error);
    return NextResponse.json({ error: 'Failed to fetch missions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, status, completionPercentage } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (completionPercentage !== undefined) updateData.completionPercentage = completionPercentage;
    if (status === 'in_progress' && !updateData.startedAt) updateData.startedAt = new Date();
    if (status === 'completed') {
      updateData.completedAt = new Date();
      updateData.completionPercentage = 100;
    }

    const assignment = await db.childMissionAssignment.update({
      where: { id: assignmentId },
      data: updateData,
    });

    // If mission completed, update child's week and assign next mission
    if (status === 'completed') {
      const child = await db.childProfile.findUnique({
        where: { id: assignment.childProfileId },
      });

      // Get the current mission to find curriculum
      const currentMission = await db.weeklyMission.findUnique({
        where: { id: assignment.weeklyMissionId },
      });

      if (child && currentMission) {
        await db.childProfile.update({
          where: { id: child.id },
          data: {
            currentWeek: child.currentWeek + 1,
            totalPoints: child.totalPoints + 25, // Points for completing mission
            streakDays: child.streakDays + 1,
          },
        });

        // Assign next week's mission
        const nextMission = await db.weeklyMission.findFirst({
          where: {
            curriculumId: currentMission.curriculumId,
            weekNumber: child.currentWeek + 1,
          },
        });

        if (nextMission) {
          await db.childMissionAssignment.create({
            data: {
              childProfileId: child.id,
              weeklyMissionId: nextMission.id,
              status: 'assigned',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('Error updating mission:', error);
    return NextResponse.json({ error: 'Failed to update mission' }, { status: 500 });
  }
}
