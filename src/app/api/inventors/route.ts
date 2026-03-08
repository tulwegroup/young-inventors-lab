import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all child profiles with their users and assignments
    const children = await db.childProfile.findMany({
      include: {
        user: true,
        missionAssignments: {
          include: {
            weeklyMission: true,
          },
          orderBy: { assignedDate: 'desc' },
          take: 5,
        },
        inventionJournals: {
          orderBy: { createdAt: 'desc' },
          take: 3,
        },
        childBadges: {
          include: { badge: true },
          orderBy: { earnedAt: 'desc' },
          take: 5,
        },
      },
    });

    // Transform for frontend compatibility
    const transformedChildren = children.map(child => ({
      id: child.id,
      userId: child.userId,
      displayName: child.displayName,
      age: child.age,
      learningTrack: child.learningTrack,
      interests: child.interests,
      currentWeek: child.currentWeek,
      totalPoints: child.totalPoints,
      streakDays: child.streakDays,
      user: child.user,
      missionAssignments: child.missionAssignments.map(a => ({
        id: a.id,
        status: a.status,
        completionPercentage: a.completionPercentage,
        weeklyMission: a.weeklyMission,
      })),
      inventionJournals: child.inventionJournals,
      childBadges: child.childBadges,
    }));

    return NextResponse.json(transformedChildren || []);
  } catch (error) {
    console.error('Error fetching children:', error);
    // Return empty array on error so the frontend doesn't crash
    // This handles the case where tables don't exist yet
    return NextResponse.json([]);
  }
}
