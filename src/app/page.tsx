'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, Lightbulb, Trophy, Star, MessageCircle, 
  Users, Target, Award, Zap, Palette, Wrench, TrendingUp,
  Calendar, Brain, Heart, Database, CheckCircle, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Child {
  id: string;
  displayName: string;
  age: number;
  learningTrack: string;
  interests: string; // JSON string from database
  currentWeek: number;
  totalPoints: number;
  streakDays: number;
  missionAssignments: MissionAssignment[];
  inventionJournals: Invention[];
  childBadges: ChildBadge[];
}

interface MissionAssignment {
  id: string;
  status: string;
  completionPercentage: number;
  weeklyMission: {
    missionTitle: string;
    missionSummary: string;
    coreObjective: string;
    weekNumber: number;
  };
}

interface Invention {
  id: string;
  title: string;
  problemStatement: string;
  status: string;
}

interface ChildBadge {
  id: string;
  earnedAt: string;
  badge: {
    name: string;
    description: string;
    category: string;
    pointsValue: number;
  };
}

// Helper function to parse interests from JSON string
function parseInterests(interests: string): string[] {
  try {
    if (typeof interests === 'string') {
      const parsed = JSON.parse(interests);
      return Array.isArray(parsed) ? parsed : [];
    }
    return Array.isArray(interests) ? interests : [];
  } catch {
    return [];
  }
}

export default function YoungInventorsLab() {
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [settingUp, setSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [activeTab, setActiveTab] = useState('parent');

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const res = await fetch('/api/inventors');
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setChildren(data);
        setSetupNeeded(false);
      } else {
        // Auto-run setup if no children found
        setSetupNeeded(true);
        // Automatically trigger setup
        setTimeout(() => runSetup(), 500);
      }
    } catch (err) {
      console.error('Error checking setup:', err);
      setSetupNeeded(true);
      // Automatically trigger setup on error
      setTimeout(() => runSetup(), 500);
    } finally {
      setLoading(false);
    }
  };

  const runSetup = async () => {
    setSettingUp(true);
    setError(null);
    
    try {
      const res = await fetch('/api/setup', { method: 'POST' });
      const data = await res.json();
      
      if (data.error) {
        setError(data.error + (data.details ? `: ${data.details}` : ''));
        setSettingUp(false);
        return;
      }
      
      // Fetch the newly created children
      const inventorsRes = await fetch('/api/inventors');
      const inventorsData = await inventorsRes.json();
      
      if (Array.isArray(inventorsData) && inventorsData.length > 0) {
        // Success! We have children data
        setChildren(inventorsData);
        setSetupComplete(true);
        setSetupNeeded(false);
      } else {
        // Setup reported success but no children - something went wrong
        setError('Setup completed but no data was created. Please try again or check database connection.');
      }
    } catch (err) {
      console.error('Setup error:', err);
      setError('Failed to run setup. Please check your database connection.');
    } finally {
      setSettingUp(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Show setup screen only while setting up (not after completion)
  if ((setupNeeded || settingUp) && !setupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: settingUp ? 360 : 0 }}
              transition={{ duration: settingUp ? 1 : 0.5, repeat: settingUp ? Infinity : 0 }}
              className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              {settingUp ? (
                <Loader2 className="w-10 h-10 text-white" />
              ) : (
                <Rocket className="w-10 h-10 text-white" />
              )}
            </motion.div>
            <CardTitle className="text-3xl bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Young Inventors Lab
            </CardTitle>
            <CardDescription className="text-lg">
              {settingUp ? 'Initializing your learning platform...' : 'Let\'s set up your invention learning platform!'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settingUp ? (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 text-center">
                <p className="text-sm text-orange-700">Creating database tables and seeding initial data...</p>
                <p className="text-xs text-orange-500 mt-2">This may take a few seconds</p>
              </div>
            ) : (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Setup will create:</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>✨ Parent account</li>
                  <li>👧 Mesha (Age 10) - Builder-Inventor Track</li>
                  <li>👧 Musiche (Age 8) - Creative Inventor Track</li>
                  <li>📚 52-week curriculum for each child</li>
                  <li>🎮 First weekly missions</li>
                </ul>
              </div>
            )}

            {error && (
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-sm text-red-700">{error}</p>
                <Button
                  onClick={runSetup}
                  className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  Retry Setup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const mesha = children.find(c => c.displayName === 'Mesha');
  const musiche = children.find(c => c.displayName === 'Musiche');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Young Inventors Lab
              </h1>
              <p className="text-sm text-gray-500">AI-Powered Learning Platform</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
              Week {mesha?.currentWeek || 1}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/80 border border-orange-200">
            <TabsTrigger value="parent" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Parent
            </TabsTrigger>
            <TabsTrigger value="mesha" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Wrench className="w-4 h-4 mr-2" />
              Mesha
            </TabsTrigger>
            <TabsTrigger value="musiche" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              <Palette className="w-4 h-4 mr-2" />
              Musiche
            </TabsTrigger>
          </TabsList>

          {/* Parent Dashboard */}
          <TabsContent value="parent" className="space-y-6">
            {children.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
                <CardContent className="pt-6 text-center">
                  <Database className="w-12 h-12 text-orange-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Found</h3>
                  <p className="text-gray-500 mb-4">The database appears to be empty. Click below to initialize.</p>
                  <Button onClick={runSetup} disabled={settingUp} className="bg-orange-500 hover:bg-orange-600 text-white">
                    {settingUp ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                    {settingUp ? 'Initializing...' : 'Initialize Database'}
                  </Button>
                  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {mesha && <ChildOverviewCard child={mesha} trackColor="blue" />}
                  {musiche && <ChildOverviewCard child={musiche} trackColor="pink" />}
                </div>

            {/* Weekly Summary */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  Weekly Progress Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <StatCard 
                    icon={<Target className="w-5 h-5" />}
                    label="Missions Active"
                    value={children.reduce((acc, c) => acc + c.missionAssignments.filter(m => m.status !== 'completed').length, 0).toString()}
                    color="orange"
                  />
                  <StatCard 
                    icon={<Lightbulb className="w-5 h-5" />}
                    label="Inventions"
                    value={children.reduce((acc, c) => acc + c.inventionJournals.length, 0).toString()}
                    color="amber"
                  />
                  <StatCard 
                    icon={<Trophy className="w-5 h-5" />}
                    label="Badges Earned"
                    value={children.reduce((acc, c) => acc + c.childBadges.length, 0).toString()}
                    color="yellow"
                  />
                  <StatCard 
                    icon={<Star className="w-5 h-5" />}
                    label="Total Points"
                    value={children.reduce((acc, c) => acc + c.totalPoints, 0).toString()}
                    color="orange"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Family Projects */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Family Collaboration
                </CardTitle>
                <CardDescription>Work together on exciting projects</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white">
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Family Project
                </Button>
              </CardContent>
            </Card>
              </>
            )}
          </TabsContent>

          {/* Mesha Dashboard */}
          <TabsContent value="mesha" className="space-y-6">
            {mesha && <ChildDashboard child={mesha} trackType="builder" />}
          </TabsContent>

          {/* Musiche Dashboard */}
          <TabsContent value="musiche" className="space-y-6">
            {musiche && <ChildDashboard child={musiche} trackType="creative" />}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-orange-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Young Inventors Lab - Building Tomorrow&apos;s Innovators</p>
        </div>
      </footer>
    </div>
  );
}

function ChildOverviewCard({ child, trackColor }: { child: Child; trackColor: string }) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    pink: 'from-pink-500 to-purple-500',
  } as const;

  // Female avatars for each child
  const getAvatar = (name: string) => {
    if (name === 'Mesha') return '👩‍💻'; // Girl with tech/builder theme
    if (name === 'Musiche') return '👧‍🎨'; // Girl with creative theme
    return '👧';
  };

  const activeMission = child.missionAssignments.find(m => m.status !== 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${colorClasses[trackColor as keyof typeof colorClasses]}`} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colorClasses[trackColor as keyof typeof colorClasses]} flex items-center justify-center text-2xl`}>
                {getAvatar(child.displayName)}
              </div>
              <div>
                <CardTitle>{child.displayName}</CardTitle>
                <CardDescription>
                  Age {child.age} • {child.learningTrack === 'builder_inventor' ? 'Builder-Inventor' : 'Creative Inventor'}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold">{child.totalPoints}</span>
              </div>
              <div className="text-xs text-gray-500">{child.streakDays} day streak</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeMission && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">Current Mission</span>
              </div>
              <p className="font-medium text-sm">{activeMission.weeklyMission.missionTitle}</p>
              <Progress value={activeMission.completionPercentage} className="h-2 mt-2" />
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {parseInterests(child.interests).map((interest, i) => (
              <Badge key={i} variant="outline" className="text-xs bg-orange-50">
                {interest}
              </Badge>
            ))}
          </div>

          {child.childBadges.length > 0 && (
            <div className="flex items-center gap-2">
              {child.childBadges.slice(0, 3).map((badge, i) => (
                <div key={i} className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                  <Award className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-700">{badge.badge.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChildDashboard({ child, trackType }: { child: Child; trackType: string }) {
  const trackInfo = {
    builder: {
      title: 'Builder-Inventor Track',
      description: 'Learn to build digital products and think like an inventor',
      color: 'blue',
      avatar: '👩‍💻', // Female tech/builder avatar
    },
    creative: {
      title: 'Creative Inventor Track',
      description: 'Develop creativity and invention thinking through play',
      color: 'pink',
      avatar: '👧‍🎨', // Female creative/artist avatar
    },
  } as const;

  const info = trackInfo[trackType as keyof typeof trackInfo];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Welcome Banner */}
      <Card className={`bg-gradient-to-r ${info.color === 'blue' ? 'from-blue-500 to-cyan-500' : 'from-pink-500 to-purple-500'} text-white border-0`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              {info.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Hello, {child.displayName}! 👋</h2>
              <p className="opacity-90">{info.description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span className="font-bold">{child.totalPoints} Points</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold">{child.streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-bold">Week {child.currentWeek}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Mission */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Your Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            {child.missionAssignments.length > 0 ? (
              <div className="space-y-4">
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h3 className="font-bold text-lg text-orange-800">
                    {child.missionAssignments[0].weeklyMission.missionTitle}
                  </h3>
                  <p className="text-sm text-orange-700 mt-1">
                    {child.missionAssignments[0].weeklyMission.missionSummary}
                  </p>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{child.missionAssignments[0].completionPercentage}%</span>
                    </div>
                    <Progress value={child.missionAssignments[0].completionPercentage} className="h-3" />
                  </div>
                </div>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  <Rocket className="w-4 h-4 mr-2" />
                  Continue Mission
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Rocket className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <p className="text-gray-500">No missions assigned yet!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Mentor */}
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              AI Mentor
            </CardTitle>
            <CardDescription>Ask me anything about your mission!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 min-h-24">
              <p className="text-sm text-purple-600">
                Hi {child.displayName}! I&apos;m your AI mentor. What would you like to explore today? 🚀
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ask your mentor..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-orange-300 focus:outline-none"
              />
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Inventions */}
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            My Inventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {child.inventionJournals.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4">
              {child.inventionJournals.map((invention) => (
                <div key={invention.id} className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-bold text-amber-800">{invention.title}</h4>
                  <p className="text-sm text-amber-700 mt-1 line-clamp-2">{invention.problemStatement}</p>
                  <Badge variant="outline" className="mt-2 bg-amber-100 text-amber-700">
                    {invention.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-amber-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Start your first invention!</p>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Rocket className="w-4 h-4 mr-2" />
                New Invention Idea
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            My Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          {child.childBadges.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {child.childBadges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl p-4 border border-amber-200 text-center"
                >
                  <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-amber-800">{badge.badge.name}</p>
                  <p className="text-xs text-amber-600">{badge.badge.pointsValue} pts</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-yellow-300 mx-auto mb-3" />
              <p className="text-gray-500">Complete missions to earn badges!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colorClasses = {
    orange: 'bg-orange-100 text-orange-600',
    amber: 'bg-amber-100 text-amber-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  } as const;

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center">
      <div className={`w-10 h-10 rounded-full ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
