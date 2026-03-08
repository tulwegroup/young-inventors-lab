import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 52-Week Curriculum Data for Builder-Inventor Track (Age 10)
const builderInventorMissions = [
  // Phase 1: Creator Foundations (Weeks 1-8)
  { week: 1, title: "Create a Story Generator", type: "build", phase: 1, summary: "Build a simple AI-powered story generator that creates fun short stories", objective: "Learn basic AI prompting and app structure", hours: 4, entrepreneur: "Who would enjoy your story generator?" },
  { week: 2, title: "Create a Chatbot Character", type: "build", phase: 1, summary: "Design and build a friendly chatbot character that can have conversations", objective: "Learn conversational AI and character design", hours: 5, entrepreneur: "What makes your chatbot special compared to others?" },
  { week: 3, title: "Create a Drawing Idea Generator", type: "build", phase: 1, summary: "Build an app that gives creative drawing prompts and ideas", objective: "Learn creative AI applications", hours: 4, entrepreneur: "Who needs help coming up with drawing ideas?" },
  { week: 4, title: "Create a Small AI Helper App", type: "build", phase: 1, summary: "Build a simple helper app that assists with daily tasks", objective: "Learn practical AI applications", hours: 5, entrepreneur: "What problem does your helper solve?" },
  { week: 5, title: "Create a Simple Game Idea Generator", type: "build", phase: 1, summary: "Build an app that generates fun game concepts", objective: "Learn creative content generation", hours: 4, entrepreneur: "Would game designers pay for this?" },
  { week: 6, title: "Create a Homework Helper", type: "build", phase: 1, summary: "Build an AI assistant that helps explain homework topics", objective: "Learn educational AI applications", hours: 5, entrepreneur: "How many students could this help?" },
  { week: 7, title: "Create a Creativity Assistant", type: "build", phase: 1, summary: "Build an app that helps spark creative ideas", objective: "Learn creativity enhancement tools", hours: 4, entrepreneur: "Who gets creative blocks that your app could help?" },
  { week: 8, title: "Create a Mini Tool Website", type: "build", phase: 1, summary: "Build a simple website with multiple helpful tools", objective: "Learn web development basics", hours: 6, entrepreneur: "What makes a website valuable to users?" },
  // Phase 2-5 continue...
  { week: 9, title: "Add User Feedback System", type: "build", phase: 2, summary: "Improve your app by adding a way to collect user feedback", objective: "Learn user research basics", hours: 5, entrepreneur: "Why is feedback important for products?" },
  { week: 10, title: "Improve Interface Design", type: "build", phase: 2, summary: "Redesign your app to make it easier and more fun to use", objective: "Learn UI/UX fundamentals", hours: 4, entrepreneur: "How does design affect user happiness?" },
  { week: 11, title: "Add New Features", type: "build", phase: 2, summary: "Expand your app with exciting new features", objective: "Learn feature prioritization", hours: 5, entrepreneur: "How do you decide which features to add?" },
  { week: 12, title: "Create a Landing Page", type: "build", phase: 2, summary: "Design an attractive page to introduce your product", objective: "Learn marketing basics", hours: 4, entrepreneur: "What makes people want to try your app?" },
  { week: 13, title: "Record a Demo Video", type: "presentation", phase: 2, summary: "Create a video showing how your app works", objective: "Learn product demonstration", hours: 3, entrepreneur: "How do you explain your product clearly?" },
  { week: 14, title: "Create User Instructions", type: "build", phase: 2, summary: "Write clear instructions so anyone can use your app", objective: "Learn documentation skills", hours: 4, entrepreneur: "Why do products need good instructions?" },
  { week: 15, title: "Add Save & Share Features", type: "build", phase: 2, summary: "Let users save and share their creations", objective: "Learn social features", hours: 5, entrepreneur: "How does sharing help products grow?" },
  { week: 16, title: "Polish Your Product", type: "build", phase: 2, summary: "Fix bugs, improve speed, and make everything work smoothly", objective: "Learn quality assurance", hours: 6, entrepreneur: "Why does quality matter for success?" },
  // Phase 3: Inventor Thinking (Weeks 17-26)
  { week: 17, title: "Invent a Problem Solver", type: "inventor", phase: 3, summary: "Identify a problem in your daily life and invent a solution", objective: "Learn problem identification", hours: 4, ipFocus: "What makes your idea an invention?" },
  { week: 18, title: "Design a New Tool", type: "inventor", phase: 3, summary: "Design a tool that helps people do something easier", objective: "Learn tool design thinking", hours: 5, ipFocus: "Could your tool design be protected?" },
  { week: 19, title: "Create a Time-Saving Device", type: "inventor", phase: 3, summary: "Invent something that saves people time", objective: "Learn value creation", hours: 4, entrepreneur: "How much time could your invention save?" },
  { week: 20, title: "Design for Accessibility", type: "inventor", phase: 3, summary: "Create an invention that helps people with disabilities", objective: "Learn inclusive design", hours: 5, entrepreneur: "Who benefits from accessible designs?" },
  { week: 21, title: "Improve an Existing Product", type: "inventor", phase: 3, summary: "Take something that exists and make it better", objective: "Learn iterative improvement", hours: 4, ipFocus: "Can improvements be patented?" },
  { week: 22, title: "Design a Learning Tool", type: "inventor", phase: 3, summary: "Invent something that helps kids learn", objective: "Learn educational product design", hours: 5, entrepreneur: "How big is the education market?" },
  { week: 23, title: "Create a Safety Invention", type: "inventor", phase: 3, summary: "Design something that keeps people safe", objective: "Learn safety-focused design", hours: 4, entrepreneur: "Why are safety products important?" },
  { week: 24, title: "Invent a Sustainability Solution", type: "inventor", phase: 3, summary: "Create something that helps the environment", objective: "Learn sustainable design", hours: 5, entrepreneur: "How big is the green market?" },
  { week: 25, title: "Design a Family Helper", type: "inventor", phase: 3, summary: "Invent something that helps families work together", objective: "Learn family-focused design", hours: 4, entrepreneur: "What do families need help with?" },
  { week: 26, title: "Present Your Best Invention", type: "presentation", phase: 3, summary: "Choose your best invention and present it professionally", objective: "Learn presentation skills", hours: 5, entrepreneur: "How would you pitch your invention?" },
  // Phase 4: Mini Startup Projects (Weeks 27-39)
  { week: 27, title: "AI Homework Planner - Design", type: "build", phase: 4, summary: "Design an AI-powered homework planning app", objective: "Learn product planning", hours: 4, entrepreneur: "Who would use a homework planner?" },
  { week: 28, title: "AI Homework Planner - Build", type: "build", phase: 4, summary: "Build your homework planner prototype", objective: "Learn prototype development", hours: 6, entrepreneur: "What makes students want to use it?" },
  { week: 29, title: "Creativity Generator - Design", type: "build", phase: 4, summary: "Design an app that sparks creativity", objective: "Learn creative tool design", hours: 4, entrepreneur: "How do you measure creativity?" },
  { week: 30, title: "Creativity Generator - Build", type: "build", phase: 4, summary: "Build your creativity generator", objective: "Learn creative AI development", hours: 6, entrepreneur: "Who needs creativity boosts?" },
  { week: 31, title: "Kid Habit Tracker - Design", type: "build", phase: 4, summary: "Design a fun habit tracker for kids", objective: "Learn gamification basics", hours: 4, entrepreneur: "Why do habit apps succeed?" },
  { week: 32, title: "Kid Habit Tracker - Build", type: "build", phase: 4, summary: "Build your habit tracker prototype", objective: "Learn engagement mechanics", hours: 6, entrepreneur: "How do you keep kids engaged?" },
  { week: 33, title: "Reading Helper - Design", type: "build", phase: 4, summary: "Design an AI assistant that helps kids love reading", objective: "Learn educational app design", hours: 4, entrepreneur: "What problems do young readers face?" },
  { week: 34, title: "Reading Helper - Build", type: "build", phase: 4, summary: "Build your reading helper prototype", objective: "Learn reading technology", hours: 6, entrepreneur: "How do you make reading fun?" },
  { week: 35, title: "AI Storytelling Tool - Design", type: "build", phase: 4, summary: "Design a tool that helps kids create amazing stories", objective: "Learn storytelling tools", hours: 4, entrepreneur: "What makes a great storytelling tool?" },
  { week: 36, title: "AI Storytelling Tool - Build", type: "build", phase: 4, summary: "Build your storytelling tool", objective: "Learn narrative AI", hours: 6, entrepreneur: "Who are your users?" },
  { week: 37, title: "Friendship Reminder App - Design", type: "build", phase: 4, summary: "Design an app that helps kids stay connected with friends", objective: "Learn social app design", hours: 4, entrepreneur: "How do social apps make money?" },
  { week: 38, title: "Friendship Reminder App - Build", type: "build", phase: 4, summary: "Build your friendship app prototype", objective: "Learn social features", hours: 6, entrepreneur: "How do you protect user privacy?" },
  { week: 39, title: "Choose Your Best Project", type: "presentation", phase: 4, summary: "Review all your projects and pick the best one to improve", objective: "Learn project evaluation", hours: 4, entrepreneur: "What makes a project worth continuing?" },
  // Phase 5: Product Launch and Presentation (Weeks 40-52)
  { week: 40, title: "Define Your Final Product", type: "build", phase: 5, summary: "Choose and plan your final product to launch", objective: "Learn product strategy", hours: 4, entrepreneur: "Why did you choose this product?" },
  { week: 41, title: "Research Your Users", type: "build", phase: 5, summary: "Learn who would use your product and what they need", objective: "Learn user research", hours: 4, entrepreneur: "How do you find your target users?" },
  { week: 42, title: "Finalize Your Design", type: "build", phase: 5, summary: "Create the final design for your product", objective: "Learn design finalization", hours: 5, entrepreneur: "How does design affect success?" },
  { week: 43, title: "Build Core Features", type: "build", phase: 5, summary: "Implement the most important features of your product", objective: "Learn feature prioritization", hours: 6, entrepreneur: "What features are essential vs nice-to-have?" },
  { week: 44, title: "Add Polish and Quality", type: "build", phase: 5, summary: "Make your product look professional and work smoothly", objective: "Learn quality polish", hours: 5, entrepreneur: "Why does polish matter?" },
  { week: 45, title: "Create Your Brand", type: "build", phase: 5, summary: "Design a name, logo, and style for your product", objective: "Learn branding basics", hours: 4, ipFocus: "How do you protect your brand?", entrepreneur: "What makes a memorable brand?" },
  { week: 46, title: "Build Your Landing Page", type: "build", phase: 5, summary: "Create a professional page to showcase your product", objective: "Learn marketing pages", hours: 5, entrepreneur: "What makes people sign up?" },
  { week: 47, title: "Write Your Pitch", type: "presentation", phase: 5, summary: "Create a compelling story about your product", objective: "Learn pitching", hours: 4, entrepreneur: "How do you get people excited?" },
  { week: 48, title: "Create Demo Materials", type: "presentation", phase: 5, summary: "Make videos and screenshots showing your product", objective: "Learn demo creation", hours: 5, entrepreneur: "What makes a great demo?" },
  { week: 49, title: "Practice Your Presentation", type: "presentation", phase: 5, summary: "Rehearse presenting your product to others", objective: "Learn presentation skills", hours: 4, entrepreneur: "How do great presenters connect?" },
  { week: 50, title: "Get Feedback and Improve", type: "build", phase: 5, summary: "Show your product and use feedback to make it better", objective: "Learn iteration", hours: 5, entrepreneur: "How do you handle criticism?" },
  { week: 51, title: "Final Polish", type: "build", phase: 5, summary: "Make final improvements based on feedback", objective: "Learn final refinement", hours: 5, entrepreneur: "When is a product ready to launch?" },
  { week: 52, title: "Launch Day! 🚀", type: "presentation", phase: 5, summary: "Present your finished product to family and friends!", objective: "Learn product launch", hours: 4, entrepreneur: "How do you celebrate success?" },
];

// 52-Week Curriculum Data for Creative Inventor Track (Age 8)
const creativeInventorMissions = [
  // Phase 1: AI Creativity Lab (Weeks 1-8)
  { week: 1, title: "Create Your First Cartoon Character", type: "creative", phase: 1, summary: "Draw and describe a fun cartoon character using AI help", objective: "Learn character creation", hours: 2 },
  { week: 2, title: "Design a Magical Creature", type: "creative", phase: 1, summary: "Create an amazing magical creature from your imagination", objective: "Learn creative imagination", hours: 2 },
  { week: 3, title: "Invent a Superhero", type: "creative", phase: 1, summary: "Design your own superhero with special powers", objective: "Learn hero storytelling", hours: 3 },
  { week: 4, title: "Create a Story World", type: "creative", phase: 1, summary: "Imagine and describe a whole new world", objective: "Learn worldbuilding", hours: 3 },
  { week: 5, title: "Make a Comic Strip", type: "creative", phase: 1, summary: "Create a short comic with your character", objective: "Learn visual storytelling", hours: 3 },
  { week: 6, title: "Create an Animated Story", type: "creative", phase: 1, summary: "Make your characters come alive in a story", objective: "Learn animation basics", hours: 3 },
  { week: 7, title: "Design a Fantasy Friend", type: "creative", phase: 1, summary: "Create a magical friend with special abilities", objective: "Learn friendship themes", hours: 2 },
  { week: 8, title: "Showcase Your Characters", type: "presentation", phase: 1, summary: "Present all your amazing characters", objective: "Learn presentation basics", hours: 2 },
  // Phase 2: Inventor Play (Weeks 9-16)
  { week: 9, title: "Invent a Room Cleaner", type: "inventor", phase: 2, summary: "Draw a machine that helps kids clean their room", objective: "Learn problem-solving", hours: 2 },
  { week: 10, title: "Invent a Homework Helper", type: "inventor", phase: 2, summary: "Design a fun machine that makes homework easier", objective: "Learn educational design", hours: 2 },
  { week: 11, title: "Invent a Meal Maker", type: "inventor", phase: 2, summary: "Create a machine that can make any food you want", objective: "Learn creative solutions", hours: 2 },
  { week: 12, title: "Invent a Weather Changer", type: "inventor", phase: 2, summary: "Design a machine that can change the weather", objective: "Learn imaginative thinking", hours: 3 },
  { week: 13, title: "Invent a Dream Recorder", type: "inventor", phase: 2, summary: "Create a device that records your dreams", objective: "Learn creative technology", hours: 2 },
  { week: 14, title: "Invent a Pet Translator", type: "inventor", phase: 2, summary: "Design a device that lets you talk to animals", objective: "Learn empathy design", hours: 2 },
  { week: 15, title: "Invent a Time Machine", type: "inventor", phase: 2, summary: "Design your own time travel machine", objective: "Learn imaginative concepts", hours: 3 },
  { week: 16, title: "Present Your Machines", type: "presentation", phase: 2, summary: "Show off your amazing inventions to your family", objective: "Learn invention presentation", hours: 2 },
  // Phase 3: Story Worlds (Weeks 17-26)
  { week: 17, title: "Create an Underwater Kingdom", type: "creative", phase: 3, summary: "Imagine and design a world under the sea", objective: "Learn environmental storytelling", hours: 3 },
  { week: 18, title: "Create a Sky City", type: "creative", phase: 3, summary: "Design a magical city that floats in the clouds", objective: "Learn fantasy design", hours: 3 },
  { week: 19, title: "Create a Dinosaur World", type: "creative", phase: 3, summary: "Imagine a world where dinosaurs still exist", objective: "Learn prehistoric imagination", hours: 2 },
  { week: 20, title: "Create a Robot Planet", type: "creative", phase: 3, summary: "Design a planet where robots live", objective: "Learn sci-fi concepts", hours: 3 },
  { week: 21, title: "Create a Candy Land", type: "creative", phase: 3, summary: "Imagine a world made entirely of candy", objective: "Learn whimsical design", hours: 2 },
  { week: 22, title: "Create a Tiny World", type: "creative", phase: 3, summary: "Design a world for tiny creatures", objective: "Learn scale imagination", hours: 3 },
  { week: 23, title: "Create a Giant World", type: "creative", phase: 3, summary: "Imagine a world where everything is huge", objective: "Learn perspective thinking", hours: 2 },
  { week: 24, title: "Create a Future City", type: "creative", phase: 3, summary: "Design what cities might look like in 100 years", objective: "Learn future thinking", hours: 3 },
  { week: 25, title: "Create a Magical Forest", type: "creative", phase: 3, summary: "Imagine an enchanted forest full of secrets", objective: "Learn magical storytelling", hours: 3 },
  { week: 26, title: "Present Your Worlds", type: "presentation", phase: 3, summary: "Show all your amazing worlds to your family", objective: "Learn world presentation", hours: 2 },
  // Phase 4: Product Imagination (Weeks 27-39)
  { week: 27, title: "Invent a New Toy", type: "inventor", phase: 4, summary: "Design a toy that every kid would love", objective: "Learn toy design", hours: 2 },
  { week: 28, title: "Invent a New Game", type: "inventor", phase: 4, summary: "Create a brand new game to play with friends", objective: "Learn game design", hours: 3 },
  { week: 29, title: "Invent a Helper Robot", type: "inventor", phase: 4, summary: "Design a robot that helps kids with something important", objective: "Learn practical robotics", hours: 2 },
  { week: 30, title: "Invent a New App Idea", type: "inventor", phase: 4, summary: "Imagine an app that would be amazing for kids", objective: "Learn app concepts", hours: 3 },
  { week: 31, title: "Invent a Super Vehicle", type: "inventor", phase: 4, summary: "Design the coolest vehicle ever", objective: "Learn transportation design", hours: 2 },
  { week: 32, title: "Invent a Learning Tool", type: "inventor", phase: 4, summary: "Create something that makes learning fun", objective: "Learn educational design", hours: 3 },
  { week: 33, title: "Invent a Friend Maker", type: "inventor", phase: 4, summary: "Design something that helps kids make friends", objective: "Learn social design", hours: 2 },
  { week: 34, title: "Invent a Safety Gadget", type: "inventor", phase: 4, summary: "Create something that keeps kids safe", objective: "Learn safety design", hours: 3 },
  { week: 35, title: "Invent an Art Creator", type: "inventor", phase: 4, summary: "Design a machine that helps kids make amazing art", objective: "Learn creative tools", hours: 2 },
  { week: 36, title: "Invent a Music Maker", type: "inventor", phase: 4, summary: "Create something that helps kids make music", objective: "Learn music technology", hours: 3 },
  { week: 37, title: "Invent a Nature Helper", type: "inventor", phase: 4, summary: "Design something that helps animals or plants", objective: "Learn environmental design", hours: 2 },
  { week: 38, title: "Invent a Space Explorer", type: "inventor", phase: 4, summary: "Create a tool or vehicle for exploring space", objective: "Learn space concepts", hours: 3 },
  { week: 39, title: "Choose Your Best Invention", type: "presentation", phase: 4, summary: "Pick your favorite invention and explain why it's the best", objective: "Learn self-evaluation", hours: 2 },
  // Phase 5: Creator Showcase (Weeks 40-52)
  { week: 40, title: "Plan Your Storybook", type: "creative", phase: 5, summary: "Plan an amazing storybook with your best characters and worlds", objective: "Learn project planning", hours: 2 },
  { week: 41, title: "Design Storybook Characters", type: "creative", phase: 5, summary: "Create the main characters for your storybook", objective: "Learn character development", hours: 3 },
  { week: 42, title: "Create Storybook Pages", type: "creative", phase: 5, summary: "Draw and write the pages of your storybook", objective: "Learn book creation", hours: 3 },
  { week: 43, title: "Add Storybook Details", type: "creative", phase: 5, summary: "Add colors, backgrounds, and details to your storybook", objective: "Learn illustration", hours: 2 },
  { week: 44, title: "Create an Invention Gallery", type: "creative", phase: 5, summary: "Collect all your best inventions in a gallery", objective: "Learn curation", hours: 3 },
  { week: 45, title: "Design Gallery Cards", type: "creative", phase: 5, summary: "Create cards that explain each invention", objective: "Learn explanation writing", hours: 2 },
  { week: 46, title: "Start a Cartoon Series", type: "creative", phase: 5, summary: "Create the first episodes of your cartoon series", objective: "Learn series creation", hours: 3 },
  { week: 47, title: "Design Cartoon Characters", type: "creative", phase: 5, summary: "Create the main characters for your cartoon series", objective: "Learn character series", hours: 2 },
  { week: 48, title: "Create Story Scripts", type: "creative", phase: 5, summary: "Write the stories for your cartoon episodes", objective: "Learn scriptwriting", hours: 3 },
  { week: 49, title: "Practice Presenting", type: "presentation", phase: 5, summary: "Practice showing your storybook, gallery, and cartoons", objective: "Learn presentation rehearsal", hours: 2 },
  { week: 50, title: "Get Feedback", type: "presentation", phase: 5, summary: "Show your work to family and get their thoughts", objective: "Learn receiving feedback", hours: 2 },
  { week: 51, title: "Final Improvements", type: "creative", phase: 5, summary: "Make your work even better based on feedback", objective: "Learn improvement", hours: 3 },
  { week: 52, title: "Big Showcase Day! 🎉", type: "presentation", phase: 5, summary: "Present all your amazing work to your whole family!", objective: "Learn celebration", hours: 3 },
];

// Skills for the taxonomy
const skills = [
  { name: "Creative Thinking", category: "creativity", description: "Ability to generate new and original ideas" },
  { name: "Problem Solving", category: "creativity", description: "Finding solutions to challenges" },
  { name: "Design Thinking", category: "creativity", description: "Creating user-friendly solutions" },
  { name: "Idea Generation", category: "invention", description: "Coming up with new invention ideas" },
  { name: "Prototyping", category: "invention", description: "Building early versions of inventions" },
  { name: "Documentation", category: "invention", description: "Recording ideas and inventions clearly" },
  { name: "Customer Thinking", category: "entrepreneurship", description: "Understanding who would use your product" },
  { name: "Value Creation", category: "entrepreneurship", description: "Making things people want" },
  { name: "Presentation", category: "entrepreneurship", description: "Showing your ideas clearly to others" },
  { name: "Teamwork", category: "collaboration", description: "Working well with others" },
  { name: "Sharing Ideas", category: "collaboration", description: "Communicating thoughts clearly" },
  { name: "Feedback Handling", category: "collaboration", description: "Learning from others' comments" },
  { name: "Storytelling", category: "communication", description: "Telling engaging stories" },
  { name: "Drawing & Art", category: "communication", description: "Creating visual representations" },
  { name: "Writing", category: "communication", description: "Expressing ideas in text" },
  { name: "AI Tool Usage", category: "technical", description: "Using AI tools effectively" },
  { name: "App Building", category: "technical", description: "Creating simple applications" },
  { name: "Digital Literacy", category: "technical", description: "Understanding technology" },
];

// Badges
const badges = [
  { name: "First Idea", description: "Created your first invention idea", category: "invention", points: 10 },
  { name: "Creative Spark", description: "Showed amazing creativity", category: "creativity", points: 15 },
  { name: "Team Player", description: "Worked great with your sibling", category: "collaboration", points: 20 },
  { name: "Young Entrepreneur", description: "Had a great business idea", category: "entrepreneurship", points: 25 },
  { name: "Story Master", description: "Created an amazing story", category: "creativity", points: 15 },
  { name: "Builder Badge", description: "Built your first app", category: "milestone", points: 30 },
  { name: "IP Expert", description: "Learned about patents and protection", category: "milestone", points: 20 },
  { name: "Week Champion", description: "Completed a week of missions", category: "milestone", points: 15 },
  { name: "Invention Journal Keeper", description: "Added 5 inventions to your journal", category: "invention", points: 25 },
  { name: "Presentation Pro", description: "Gave an amazing presentation", category: "milestone", points: 20 },
  { name: "Phase Complete", description: "Finished an entire phase", category: "milestone", points: 50 },
  { name: "Year Inventor", description: "Completed the full 52-week program", category: "milestone", points: 100 },
];

async function main() {
  console.log("Starting seed process...");

  // Check if already seeded
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("Database already seeded. Skipping...");
    return;
  }

  // Create parent user
  console.log("Creating parent user...");
  const parent = await prisma.user.create({
    data: {
      email: "parent@inventorslab.com",
      fullName: "Parent",
      password: "inventor2024", // In production, this should be hashed
      role: "parent",
      status: "active",
    },
  });

  // Create child users
  console.log("Creating child users...");
  const mesha = await prisma.user.create({
    data: {
      email: "mesha@inventorslab.com",
      fullName: "Mesha",
      role: "child",
      status: "active",
    },
  });

  const musiche = await prisma.user.create({
    data: {
      email: "musiche@inventorslab.com",
      fullName: "Musiche",
      role: "child",
      status: "active",
    },
  });

  // Create child profiles
  console.log("Creating child profiles...");
  const meshaProfile = await prisma.childProfile.create({
    data: {
      userId: mesha.id,
      displayName: "Mesha",
      age: 10,
      learningTrack: "builder_inventor",
      interests: JSON.stringify(["coding", "robots", "science", "games"]),
      currentWeek: 1,
      difficultyLevel: "beginner",
      streakDays: 0,
      totalPoints: 0,
    },
  });

  const musicheProfile = await prisma.childProfile.create({
    data: {
      userId: musiche.id,
      displayName: "Musiche",
      age: 8,
      learningTrack: "creative_inventor",
      interests: JSON.stringify(["drawing", "stories", "animals", "magic"]),
      currentWeek: 1,
      difficultyLevel: "beginner",
      streakDays: 0,
      totalPoints: 0,
    },
  });

  // Create parent-child links
  console.log("Creating parent-child links...");
  await prisma.parentChildLink.createMany({
    data: [
      { parentUserId: parent.id, childUserId: mesha.id, permissionLevel: "full" },
      { parentUserId: parent.id, childUserId: musiche.id, permissionLevel: "full" },
    ],
  });

  // Create curricula
  console.log("Creating curricula...");
  const builderCurriculum = await prisma.curriculum.create({
    data: {
      title: "Builder-Inventor Track",
      trackType: "builder_inventor",
      description: "Learn to build digital products and think like an inventor",
      totalWeeks: 52,
    },
  });

  const creativeCurriculum = await prisma.curriculum.create({
    data: {
      title: "Creative Inventor Track",
      trackType: "creative_inventor",
      description: "Develop creativity and invention thinking through play",
      totalWeeks: 52,
    },
  });

  // Create phases
  console.log("Creating curriculum phases...");
  const phaseNames = [
    { builder: "Creator Foundations", creative: "AI Creativity Lab" },
    { builder: "Product Thinking", creative: "Inventor Play" },
    { builder: "Inventor Thinking", creative: "Story Worlds" },
    { builder: "Mini Startup Projects", creative: "Product Imagination" },
    { builder: "Product Launch", creative: "Creator Showcase" },
  ];

  const builderPhases = await Promise.all(
    phaseNames.map((names, i) =>
      prisma.curriculumPhase.create({
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
    phaseNames.map((names, i) =>
      prisma.curriculumPhase.create({
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

  // Create weekly missions
  console.log("Creating weekly missions...");
  for (const mission of builderInventorMissions) {
    const phase = builderPhases[mission.phase - 1];
    await prisma.weeklyMission.create({
      data: {
        curriculumId: builderCurriculum.id,
        phaseId: phase.id,
        weekNumber: mission.week,
        missionTitle: mission.title,
        missionType: mission.type,
        missionSummary: mission.summary,
        coreObjective: mission.objective,
        estimatedHours: mission.hours,
        entrepreneurshipFocus: mission.entrepreneur,
        ipFocus: mission.ipFocus,
      },
    });
  }

  for (const mission of creativeInventorMissions) {
    const phase = creativePhases[mission.phase - 1];
    await prisma.weeklyMission.create({
      data: {
        curriculumId: creativeCurriculum.id,
        phaseId: phase.id,
        weekNumber: mission.week,
        missionTitle: mission.title,
        missionType: mission.type,
        missionSummary: mission.summary,
        coreObjective: mission.objective,
        estimatedHours: mission.hours,
      },
    });
  }

  // Create skills
  console.log("Creating skills...");
  for (const skill of skills) {
    await prisma.skillTaxonomy.create({
      data: {
        skillName: skill.name,
        skillCategory: skill.category,
        description: skill.description,
      },
    });
  }

  // Create badges
  console.log("Creating badges...");
  for (const badge of badges) {
    await prisma.badge.create({
      data: {
        name: badge.name,
        description: badge.description,
        category: badge.category,
        pointsValue: badge.points,
      },
    });
  }

  // Create app state
  console.log("Creating app state...");
  await prisma.appState.createMany({
    data: [
      { key: "current_week", value: "1" },
      { key: "system_initialized", value: "true" },
    ],
  });

  console.log("Seed completed successfully! 🚀");
  console.log("\n=== LOGIN CREDENTIALS ===");
  console.log("Parent Login:");
  console.log("  Email: parent@inventorslab.com");
  console.log("  Password: inventor2024");
  console.log("\nChild Login Codes:");
  console.log("  Mesha (age 10): MESHA2024");
  console.log("  Musiche (age 8): MUSICHE2024");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
