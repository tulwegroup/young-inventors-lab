import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');

    if (projectId) {
      const project = await db.familyProject.findUnique({
        where: { id: projectId },
        include: {
          members: {
            include: {
              childProfile: { include: { user: true } },
            },
          },
          missions: {
            include: {
              submissions: {
                include: {
                  childProfile: { include: { user: true } },
                },
              },
            },
          },
        },
      });
      return NextResponse.json(project);
    }

    // Get all active family projects
    const projects = await db.familyProject.findMany({
      where: { status: 'active' },
      include: {
        members: {
          include: {
            childProfile: { include: { user: true } },
          },
        },
        missions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching family projects:', error);
    return NextResponse.json({ error: 'Failed to fetch family projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, projectTheme, childIds, missionTitle, missionDescription, objective } = body;

    // Create family project
    const project = await db.familyProject.create({
      data: {
        title,
        description,
        projectTheme,
        status: 'active',
        members: {
          create: childIds?.map((childId: string, index: number) => ({
            childProfileId: childId,
            roleInProject: index === 0 ? 'Lead Builder' : 'Creative Designer',
          })) || [],
        },
        missions: missionTitle
          ? {
              create: {
                missionTitle,
                missionDescription: missionDescription || '',
                objective: objective || '',
                submissionType: 'joint',
              },
            }
          : undefined,
      },
      include: {
        members: { include: { childProfile: true } },
        missions: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating family project:', error);
    return NextResponse.json({ error: 'Failed to create family project' }, { status: 500 });
  }
}
