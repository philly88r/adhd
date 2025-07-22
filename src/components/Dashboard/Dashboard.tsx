import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  Lightbulb, 
  TrendingUp, 
  Plus,
  Play,
  Star,
  Trophy,
  Target,
  Brain,
  Coffee,
  Flame,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  // Calculate today's statistics
  const today = new Date().toDateString();
  const todaysTasks = state.tasks.filter(task => 
    task.status === 'completed' && 
    new Date(task.completedAt || '').toDateString() === today
  );

  const todaysSessions = state.timerSessions.filter(session =>
    new Date(session.completedAt).toDateString() === today && 
    session.type === 'focus' && 
    session.wasCompleted
  );

  const pendingTasks = state.tasks.filter(task => 
    task.status !== 'completed'
  ).slice(0, 5); // Show top 5 pending tasks

  const recentBrainDumps = state.brainDumpEntries
    .filter(entry => !entry.processed)
    .slice(0, 3);

  const progressToNextLevel = ((state.userProgress.totalPoints % 100) / 100) * 100;

  const quickStartTimer = () => {
    dispatch({
      type: 'START_TIMER',
      payload: {
        type: 'focus',
        duration: state.settings.pomodoroMinutes
      }
    });
    navigate('/timer');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mb-4">
          <Brain className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to FocusFlow
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your ADHD-friendly productivity companion. Let's make today amazing! ✨
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{todaysTasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Focus Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{todaysSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
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

        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-2xl font-bold text-gray-900">{state.userProgress.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Level {state.userProgress.level}</h3>
                <p className="text-gray-600">
                  {100 - (state.userProgress.totalPoints % 100)} points to level {state.userProgress.level + 1}
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-100 text-yellow-800 text-lg px-3 py-1">
              {state.userProgress.totalPoints} points
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress to next level</span>
              <span className="font-medium text-gray-900">{Math.round(progressToNextLevel)}%</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={quickStartTimer}
              className="h-20 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              <div className="flex flex-col items-center space-y-2">
                <Play className="h-6 w-6" />
                <span>Start Focus</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/tasks')}
              variant="outline"
              className="h-20 border-green-200 hover:bg-green-50"
            >
              <div className="flex flex-col items-center space-y-2">
                <Plus className="h-6 w-6 text-green-600" />
                <span>New Task</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/brain-dump')}
              variant="outline"
              className="h-20 border-yellow-200 hover:bg-yellow-50"
            >
              <div className="flex flex-col items-center space-y-2">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
                <span>Brain Dump</span>
              </div>
            </Button>

            <Button
              onClick={() => navigate('/progress')}
              variant="outline"
              className="h-20 border-purple-200 hover:bg-purple-50"
            >
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span>Progress</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Timer Status */}
      {state.currentTimer.isActive && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  {state.currentTimer.type === 'focus' ? (
                    <Brain className="h-6 w-6 text-blue-600" />
                  ) : (
                    <Coffee className="h-6 w-6 text-green-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {state.currentTimer.type === 'focus' ? 'Focus Session Active' : 'Break Time'}
                  </h3>
                  <p className="text-gray-600">
                    {Math.floor(state.currentTimer.timeLeft / 60)}:{(state.currentTimer.timeLeft % 60).toString().padStart(2, '0')} remaining
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/timer')}
                className="bg-gradient-to-r from-blue-500 to-green-500"
              >
                View Timer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckSquare className="h-5 w-5 text-green-600" />
                <span>Upcoming Tasks</span>
              </div>
              <Badge variant="secondary">{pendingTasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No pending tasks! 🎉</p>
                <Button
                  onClick={() => navigate('/tasks')}
                  className="bg-gradient-to-r from-blue-500 to-green-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Task
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            task.priority === 'high' && "border-red-200 text-red-700",
                            task.priority === 'medium' && "border-yellow-200 text-yellow-700",
                            task.priority === 'low' && "border-green-200 text-green-700"
                          )}
                        >
                          {task.priority}
                        </Badge>
                        {task.subtasks.length > 0 && (
                          <span className="text-xs text-gray-500">
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} steps
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        dispatch({
                          type: 'START_TIMER',
                          payload: {
                            type: 'focus',
                            duration: state.settings.pomodoroMinutes,
                            taskId: task.id
                          }
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={() => navigate('/tasks')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  View All Tasks
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Brain Dumps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <span>Recent Thoughts</span>
              </div>
              <Badge variant="secondary">{recentBrainDumps.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentBrainDumps.length === 0 ? (
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No recent thoughts captured</p>
                <Button
                  onClick={() => navigate('/brain-dump')}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start Brain Dump
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBrainDumps.map(entry => (
                  <div key={entry.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-gray-900 text-sm line-clamp-2">
                      {entry.content.length > 100 
                        ? entry.content.substring(0, 100) + '...' 
                        : entry.content
                      }
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </span>
                      {entry.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {entry.tags.slice(0, 2).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => navigate('/brain-dump')}
                  variant="outline"
                  className="w-full mt-4"
                >
                  View All Thoughts
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="text-4xl">💫</div>
            <blockquote className="text-lg font-medium text-gray-900 max-w-2xl mx-auto">
              "Progress, not perfection. Every small step counts towards building the life you want."
            </blockquote>
            <p className="text-gray-600">
              You're building amazing habits, one task at a time. Keep going! 🌟
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
