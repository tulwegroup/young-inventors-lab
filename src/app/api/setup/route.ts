import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// SQL to create all tables
const CREATE_TABLES_SQL = `
-- User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "password" TEXT,
  "role" TEXT NOT NULL DEFAULT 'parent',
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- ChildProfile table
CREATE TABLE IF NOT EXISTS "ChildProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "age" INTEGER NOT NULL,
  "learningTrack" TEXT NOT NULL,
  "interests" TEXT NOT NULL,
  "preferredLearningStyle" TEXT,
  "currentWeek" INTEGER NOT NULL DEFAULT 1,
  "difficultyLevel" TEXT NOT NULL DEFAULT 'beginner',
  "mentorPersona" TEXT NOT NULL DEFAULT 'inventor_guide',
  "activeStatus" TEXT NOT NULL DEFAULT 'active',
  "avatarUrl" TEXT,
  "streakDays" INTEGER NOT NULL DEFAULT 0,
  "totalPoints" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChildProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ChildProfile_userId_key" ON "ChildProfile"("userId");

-- ParentChildLink table
CREATE TABLE IF NOT EXISTS "ParentChildLink" (
  "id" TEXT NOT NULL,
  "parentUserId" TEXT NOT NULL,
  "childUserId" TEXT NOT NULL,
  "permissionLevel" TEXT NOT NULL DEFAULT 'full',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ParentChildLink_pkey" PRIMARY KEY ("id")
);

-- Curriculum table
CREATE TABLE IF NOT EXISTS "Curriculum" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "trackType" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "totalWeeks" INTEGER NOT NULL,
  "version" TEXT NOT NULL DEFAULT '1.0',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Curriculum_pkey" PRIMARY KEY ("id")
);

-- CurriculumPhase table
CREATE TABLE IF NOT EXISTS "CurriculumPhase" (
  "id" TEXT NOT NULL,
  "curriculumId" TEXT NOT NULL,
  "phaseNumber" INTEGER NOT NULL,
  "phaseTitle" TEXT NOT NULL,
  "phaseDescription" TEXT NOT NULL,
  "weekStart" INTEGER NOT NULL,
  "weekEnd" INTEGER NOT NULL,
  "goals" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CurriculumPhase_pkey" PRIMARY KEY ("id")
);

-- WeeklyMission table
CREATE TABLE IF NOT EXISTS "WeeklyMission" (
  "id" TEXT NOT NULL,
  "curriculumId" TEXT NOT NULL,
  "phaseId" TEXT NOT NULL,
  "weekNumber" INTEGER NOT NULL,
  "missionTitle" TEXT NOT NULL,
  "missionType" TEXT NOT NULL,
  "missionSummary" TEXT NOT NULL,
  "coreObjective" TEXT NOT NULL,
  "estimatedHours" DOUBLE PRECISION NOT NULL DEFAULT 4.0,
  "difficultyTier" TEXT NOT NULL DEFAULT 'beginner',
  "entrepreneurshipFocus" TEXT,
  "ipFocus" TEXT,
  "collaborationPossible" BOOLEAN NOT NULL DEFAULT false,
  "buildMission" TEXT,
  "inventorChallenge" TEXT,
  "entrepreneurQuestion" TEXT,
  "presentationMoment" TEXT,
  "reflectionPrompt" TEXT,
  "creativeMission" TEXT,
  "inventorGame" TEXT,
  "storyChallenge" TEXT,
  "showcaseMoment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WeeklyMission_pkey" PRIMARY KEY ("id")
);

-- ChildMissionAssignment table
CREATE TABLE IF NOT EXISTS "ChildMissionAssignment" (
  "id" TEXT NOT NULL,
  "childProfileId" TEXT NOT NULL,
  "weeklyMissionId" TEXT NOT NULL,
  "assignedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueDate" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'assigned',
  "completionPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "mentorNotes" TEXT,
  "adaptationReason" TEXT,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChildMissionAssignment_pkey" PRIMARY KEY ("id")
);

-- Badge table
CREATE TABLE IF NOT EXISTS "Badge" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "iconUrl" TEXT,
  "category" TEXT NOT NULL,
  "pointsValue" INTEGER NOT NULL DEFAULT 10,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- AppState table
CREATE TABLE IF NOT EXISTS "AppState" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AppState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AppState_key_key" ON "AppState"("key");

-- Add foreign key constraints
DO $$ BEGIN
  ALTER TABLE "ChildProfile" ADD CONSTRAINT "ChildProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "ParentChildLink" ADD CONSTRAINT "ParentChildLink_parentUserId_fkey" FOREIGN KEY ("parentUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "ParentChildLink" ADD CONSTRAINT "ParentChildLink_childUserId_fkey" FOREIGN KEY ("childUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "CurriculumPhase" ADD CONSTRAINT "CurriculumPhase_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "WeeklyMission" ADD CONSTRAINT "WeeklyMission_curriculumId_fkey" FOREIGN KEY ("curriculumId") REFERENCES "Curriculum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "WeeklyMission" ADD CONSTRAINT "WeeklyMission_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "CurriculumPhase"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "ChildMissionAssignment" ADD CONSTRAINT "ChildMissionAssignment_childProfileId_fkey" FOREIGN KEY ("childProfileId") REFERENCES "ChildProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "ChildMissionAssignment" ADD CONSTRAINT "ChildMissionAssignment_weeklyMissionId_fkey" FOREIGN KEY ("weeklyMissionId") REFERENCES "WeeklyMission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
`;

async function ensureTablesExist() {
  console.log('Creating tables if they don\'t exist...');
  
  // Split SQL into individual statements and execute them
  const statements = CREATE_TABLES_SQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await db.$executeRawUnsafe(statement + ';');
      } catch (error) {
        // Ignore errors for already existing constraints/indexes
        const errMsg = String(error);
        if (!errMsg.includes('already exists') && !errMsg.includes('duplicate_object')) {
          console.log('SQL statement error (continuing):', errMsg.substring(0, 100));
        }
      }
    }
  }
  
  console.log('Tables created/verified');
}

export async function POST() {
  try {
    console.log('Starting database setup...');

    // First, ensure tables exist
    await ensureTablesExist();

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
        id: 'user_parent_' + Date.now(),
        email: 'parent@inventorslab.com',
        fullName: 'Parent',
        password: 'inventor2024',
        role: 'parent',
        status: 'active',
        updatedAt: new Date(),
      },
    });

    // Create child users
    const mesha = await db.user.create({
      data: {
        id: 'user_mesha_' + Date.now(),
        email: 'mesha@inventorslab.com',
        fullName: 'Mesha',
        role: 'child',
        status: 'active',
        updatedAt: new Date(),
      },
    });

    const musiche = await db.user.create({
      data: {
        id: 'user_musiche_' + Date.now(),
        email: 'musiche@inventorslab.com',
        fullName: 'Musiche',
        role: 'child',
        status: 'active',
        updatedAt: new Date(),
      },
    });

    // Create child profiles
    const meshaProfile = await db.childProfile.create({
      data: {
        id: 'profile_mesha_' + Date.now(),
        userId: mesha.id,
        displayName: 'Mesha',
        age: 10,
        learningTrack: 'builder_inventor',
        interests: JSON.stringify(['coding', 'robots', 'science', 'games']),
        currentWeek: 1,
        difficultyLevel: 'beginner',
        streakDays: 0,
        totalPoints: 0,
        updatedAt: new Date(),
      },
    });

    const musicheProfile = await db.childProfile.create({
      data: {
        id: 'profile_musiche_' + Date.now(),
        userId: musiche.id,
        displayName: 'Musiche',
        age: 8,
        learningTrack: 'creative_inventor',
        interests: JSON.stringify(['drawing', 'stories', 'animals', 'magic']),
        currentWeek: 1,
        difficultyLevel: 'beginner',
        streakDays: 0,
        totalPoints: 0,
        updatedAt: new Date(),
      },
    });

    // Create parent-child links
    await db.parentChildLink.createMany({
      data: [
        { id: 'link_mesha_' + Date.now(), parentUserId: parent.id, childUserId: mesha.id, permissionLevel: 'full' },
        { id: 'link_musiche_' + Date.now(), parentUserId: parent.id, childUserId: musiche.id, permissionLevel: 'full' },
      ],
    });

    // Create curricula
    const builderCurriculum = await db.curriculum.create({
      data: {
        id: 'curriculum_builder_' + Date.now(),
        title: 'Builder-Inventor Track',
        trackType: 'builder_inventor',
        description: 'Learn to build digital products and think like an inventor',
        totalWeeks: 52,
        updatedAt: new Date(),
      },
    });

    const creativeCurriculum = await db.curriculum.create({
      data: {
        id: 'curriculum_creative_' + Date.now(),
        title: 'Creative Inventor Track',
        trackType: 'creative_inventor',
        description: 'Develop creativity and invention thinking through play',
        totalWeeks: 52,
        updatedAt: new Date(),
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
            id: 'phase_builder_' + i + '_' + Date.now(),
            curriculumId: builderCurriculum.id,
            phaseNumber: i + 1,
            phaseTitle: names.builder,
            phaseDescription: `Phase ${i + 1} of Builder-Inventor Track`,
            weekStart: i * 8 + 1,
            weekEnd: Math.min((i + 1) * 8, 52),
            goals: JSON.stringify([]),
            updatedAt: new Date(),
          },
        })
      )
    );

    const creativePhases = await Promise.all(
      phases.map((names, i) =>
        db.curriculumPhase.create({
          data: {
            id: 'phase_creative_' + i + '_' + Date.now(),
            curriculumId: creativeCurriculum.id,
            phaseNumber: i + 1,
            phaseTitle: names.creative,
            phaseDescription: `Phase ${i + 1} of Creative Inventor Track`,
            weekStart: i * 8 + 1,
            weekEnd: Math.min((i + 1) * 8, 52),
            goals: JSON.stringify([]),
            updatedAt: new Date(),
          },
        })
      )
    );

    // Create first missions
    const builderMission1 = await db.weeklyMission.create({
      data: {
        id: 'mission_builder_1_' + Date.now(),
        curriculumId: builderCurriculum.id,
        phaseId: builderPhases[0].id,
        weekNumber: 1,
        missionTitle: 'Create a Story Generator',
        missionType: 'build',
        missionSummary: 'Build a simple AI-powered story generator that creates fun short stories',
        coreObjective: 'Learn basic AI prompting and app structure',
        estimatedHours: 4,
        entrepreneurshipFocus: 'Who would enjoy your story generator?',
        updatedAt: new Date(),
      },
    });

    const creativeMission1 = await db.weeklyMission.create({
      data: {
        id: 'mission_creative_1_' + Date.now(),
        curriculumId: creativeCurriculum.id,
        phaseId: creativePhases[0].id,
        weekNumber: 1,
        missionTitle: 'Create Your First Cartoon Character',
        missionType: 'creative',
        missionSummary: 'Draw and describe a fun cartoon character using AI help',
        coreObjective: 'Learn character creation',
        estimatedHours: 2,
        updatedAt: new Date(),
      },
    });

    // Assign first missions
    await db.childMissionAssignment.create({
      data: {
        id: 'assignment_mesha_1_' + Date.now(),
        childProfileId: meshaProfile.id,
        weeklyMissionId: builderMission1.id,
        status: 'assigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    });

    await db.childMissionAssignment.create({
      data: {
        id: 'assignment_musiche_1_' + Date.now(),
        childProfileId: musicheProfile.id,
        weeklyMissionId: creativeMission1.id,
        status: 'assigned',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
    });

    // Create badges
    await db.badge.createMany({
      data: [
        { id: 'badge_1_' + Date.now(), name: 'First Idea', description: 'Created your first invention idea', category: 'invention', pointsValue: 10 },
        { id: 'badge_2_' + Date.now(), name: 'Creative Spark', description: 'Showed amazing creativity', category: 'creativity', pointsValue: 15 },
        { id: 'badge_3_' + Date.now(), name: 'Team Player', description: 'Worked great with your sibling', category: 'collaboration', pointsValue: 20 },
        { id: 'badge_4_' + Date.now(), name: 'Young Entrepreneur', description: 'Had a great business idea', category: 'entrepreneurship', pointsValue: 25 },
        { id: 'badge_5_' + Date.now(), name: 'Week Champion', description: 'Completed a week of missions', category: 'milestone', pointsValue: 15 },
      ],
    });

    // Create app state
    await db.appState.create({
      data: {
        id: 'appstate_init_' + Date.now(),
        key: 'initialized',
        value: 'true',
        updatedAt: new Date(),
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
    // Try to ensure tables exist first
    await ensureTablesExist().catch(() => {});
    
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
