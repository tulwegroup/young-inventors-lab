import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all child profiles with their users
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

    // Return empty array if no children found
    return NextResponse.json(children || []);
  } catch (error) {
    console.error('Error fetching children:', error);
    // Return empty array on error so the frontend doesn't crash
    return NextResponse.json([]);
  }
}
