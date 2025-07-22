import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  TrendingUp, 
  Calendar,
  Clock,
  CheckCircle,
  Flame,
  Award,
  BarChart3,
  Activity,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProgressDashboard() {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  // Calculate progress metrics
  const totalPoints = state.userProgress.totalPoints;
  const currentLevel = state.userProgress.level;
  const pointsToNextLevel = 100 - (totalPoints % 100);
  const progressToNextLevel = ((totalPoints % 100) / 100) * 100;

  // Get achievements
  const earnedAchievements = state.userProgress.achievements.filter(a => a.earnedAt);
  const unlockedAchievements = state.userProgress.achievements.filter(a => !a.earnedAt);

  // Calculate streaks and stats
  const todaysTasks = state.tasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.completedAt || '').toDateString() === new Date().toDateString()
  );

  const thisWeekSessions = state.timerSessions.filter(session => {
    const sessionDate = new Date(session.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo && session.type === 'focus' && session.wasCompleted;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your achievements and celebrate your wins! 🎉</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Trophy className="h-3 w-3 mr-1" />
            Level {currentLevel}
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Star className="h-3 w-3 mr-1" />
            {totalPoints} points
          </Badge>
        </div>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Level {currentLevel}</h3>
                  <p className="text-gray-600">
                    {pointsToNextLevel} points to level {currentLevel + 1}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{totalPoints}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress to next level</span>
                <span className="font-medium text-gray-900">{Math.round(progressToNextLevel)}%</span>
              </div>
              <Progress value={progressToNextLevel} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-6">
          <WeeklyStats />
        </TabsContent>

        <TabsContent value="month" className="space-y-6">
          <MonthlyStats />
        </TabsContent>

        <TabsContent value="all" className="space-y-6">
          <AllTimeStats />
        </TabsContent>
      </Tabs>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{todaysTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week's Focus</p>
                <p className="text-2xl font-bold text-gray-900">{thisWeekSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{state.userProgress.streakDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{earnedAchievements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AchievementGrid achievements={state.userProgress.achievements} />
        </CardContent>
      </Card>

      {/* Motivational Section */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-4xl">🌟</div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You're Making Amazing Progress!</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {getMotivationalMessage(state.userProgress)}
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">
                🎯 {state.userProgress.tasksCompleted} tasks completed
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                ⚡ {state.userProgress.focusSessionsCompleted} focus sessions
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Weekly Stats Component
function WeeklyStats() {
  const { state } = useApp();
  
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weeklyTasks = state.tasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.completedAt || '') >= weekStart
  );

  const weeklySessions = state.timerSessions.filter(session =>
    new Date(session.completedAt) >= weekStart && session.type === 'focus'
  );

  const weeklyMinutes = weeklySessions.reduce((total, session) => total + session.duration, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{weeklyTasks.length}</p>
            <p className="text-sm text-gray-600">Tasks Completed</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Clock className="h-8 w-8 text-blue-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{weeklySessions.length}</p>
            <p className="text-sm text-gray-600">Focus Sessions</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Activity className="h-8 w-8 text-purple-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{weeklyMinutes}</p>
            <p className="text-sm text-gray-600">Minutes Focused</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Monthly Stats Component
function MonthlyStats() {
  const { state } = useApp();
  
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthlyTasks = state.tasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.completedAt || '') >= monthStart
  );

  const monthlySessions = state.timerSessions.filter(session =>
    new Date(session.completedAt) >= monthStart && session.type === 'focus'
  );

  const monthlyMinutes = monthlySessions.reduce((total, session) => total + session.duration, 0);
  const monthlyHours = Math.round(monthlyMinutes / 60 * 10) / 10;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{monthlyTasks.length}</p>
            <p className="text-sm text-gray-600">Tasks This Month</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Clock className="h-8 w-8 text-blue-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{monthlySessions.length}</p>
            <p className="text-sm text-gray-600">Focus Sessions</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Activity className="h-8 w-8 text-purple-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{monthlyHours}h</p>
            <p className="text-sm text-gray-600">Hours Focused</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// All Time Stats Component
function AllTimeStats() {
  const { state } = useApp();
  
  const totalMinutes = state.timerSessions
    .filter(s => s.type === 'focus')
    .reduce((total, session) => total + session.duration, 0);
  const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{state.userProgress.tasksCompleted}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Clock className="h-8 w-8 text-blue-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{state.userProgress.focusSessionsCompleted}</p>
            <p className="text-sm text-gray-600">Total Sessions</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <Activity className="h-8 w-8 text-purple-600 mx-auto" />
            <p className="text-3xl font-bold text-gray-900">{totalHours}h</p>
            <p className="text-sm text-gray-600">Total Focus Time</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Achievement Grid Component
function AchievementGrid({ achievements }: { achievements: any[] }) {
  const earned = achievements.filter(a => a.earnedAt);
  const unearned = achievements.filter(a => !a.earnedAt);

  return (
    <div className="space-y-6">
      {/* Earned Achievements */}
      {earned.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Unlocked Achievements ({earned.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earned.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} earned={true} />
            ))}
          </div>
        </div>
      )}

      {/* Unearned Achievements */}
      {unearned.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
            <Target className="h-4 w-4 text-gray-500" />
            <span>Goals to Unlock ({unearned.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unearned.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} earned={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Achievement Card
function AchievementCard({ achievement, earned }: { achievement: any; earned: boolean }) {
  const IconName = achievement.iconName || 'Trophy';
  
  // Map icon names to actual components
  const iconMap: { [key: string]: any } = {
    Trophy,
    Star,
    Target,
    Flame,
    CheckCircle
  };
  
  const Icon = iconMap[IconName] || Trophy;

  return (
    <Card className={cn(
      "transition-all duration-200",
      earned 
        ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md" 
        : "bg-gray-50 border-gray-200"
    )}>
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mx-auto",
            earned 
              ? "bg-gradient-to-r from-yellow-400 to-orange-400" 
              : "bg-gray-300"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              earned ? "text-white" : "text-gray-600"
            )} />
          </div>
          
          <div>
            <h4 className={cn(
              "font-medium",
              earned ? "text-gray-900" : "text-gray-600"
            )}>
              {achievement.title}
            </h4>
            <p className={cn(
              "text-sm",
              earned ? "text-gray-700" : "text-gray-500"
            )}>
              {achievement.description}
            </p>
          </div>

          {earned && achievement.earnedAt && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
              Earned {new Date(achievement.earnedAt).toLocaleDateString()}
            </Badge>
          )}
          
          {!earned && (
            <div className="text-xs text-gray-500">
              Goal: {achievement.requirement.target} {achievement.requirement.type.replace('_', ' ')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function for motivational messages
function getMotivationalMessage(userProgress: any): string {
  const messages = [
    "Every task completed is a step towards your goals. Keep going!",
    "Your consistency is building amazing habits. You're doing fantastic!",
    "Progress isn't always linear, but you're moving in the right direction.",
    "Each focus session strengthens your concentration muscle. Well done!",
    "Your dedication to growth is inspiring. Continue this amazing journey!",
    "Small steps lead to big achievements. You're proving it every day!",
    "Your productivity skills are improving with each completed task.",
    "The effort you're putting in today will benefit your future self."
  ];

  return messages[userProgress.totalPoints % messages.length];
}
