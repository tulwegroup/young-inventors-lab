import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const childId = searchParams.get('childId');
    const inventionId = searchParams.get('id');

    if (inventionId) {
      const invention = await db.inventionJournal.findUnique({
        where: { id: inventionId },
        include: {
          artifacts: true,
          tags: true,
          ipReviews: true,
          versions: { orderBy: { versionNumber: 'desc' } },
        },
      });
      return NextResponse.json(invention);
    }

    if (!childId) {
      return NextResponse.json({ error: 'Child ID required' }, { status: 400 });
    }

    const inventions = await db.inventionJournal.findMany({
      where: { childProfileId: childId },
      include: {
        artifacts: true,
        tags: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(inventions);
  } catch (error) {
    console.error('Error fetching inventions:', error);
    return NextResponse.json({ error: 'Failed to fetch inventions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      childProfileId,
      title,
      problemStatement,
      inventionDescription,
      targetUser,
      howItWorks,
      noveltyClaim,
      entrepreneurshipIdea,
      ipCategoryGuess,
      weekNumber,
      tags,
    } = body;

    const invention = await db.inventionJournal.create({
      data: {
        childProfileId,
        title,
        problemStatement,
        inventionDescription,
        targetUser,
        howItWorks,
        noveltyClaim,
        entrepreneurshipIdea,
        ipCategoryGuess,
        weekNumber,
        status: 'idea',
        tags: {
          create: tags?.map((tag: string) => ({ tagName: tag })) || [],
        },
      },
      include: { tags: true },
    });

    // Award points for creating an invention
    await db.childProfile.update({
      where: { id: childProfileId },
      data: { totalPoints: { increment: 15 } },
    });

    // Create first version
    await db.inventionVersion.create({
      data: {
        inventionJournalId: invention.id,
        versionNumber: 1,
        changeSummary: 'Initial invention idea',
        updatedDescription: inventionDescription,
      },
    });

    return NextResponse.json(invention);
  } catch (error) {
    console.error('Error creating invention:', error);
    return NextResponse.json({ error: 'Failed to create invention' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    const existingInvention = await db.inventionJournal.findUnique({
      where: { id },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    });

    if (!existingInvention) {
      return NextResponse.json({ error: 'Invention not found' }, { status: 404 });
    }

    const invention = await db.inventionJournal.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    // Create new version if description changed
    if (updateData.inventionDescription && updateData.inventionDescription !== existingInvention.inventionDescription) {
      const lastVersion = existingInvention.versions[0];
      await db.inventionVersion.create({
        data: {
          inventionJournalId: id,
          versionNumber: (lastVersion?.versionNumber || 0) + 1,
          changeSummary: updateData.changeSummary || 'Updated invention',
          updatedDescription: updateData.inventionDescription,
        },
      });
    }

    return NextResponse.json(invention);
  } catch (error) {
    console.error('Error updating invention:', error);
    return NextResponse.json({ error: 'Failed to update invention' }, { status: 500 });
  }
}
