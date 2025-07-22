import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  CheckSquare, 
  Timer, 
  TrendingUp, 
  Lightbulb, 
  Menu, 
  X,
  Star,
  Trophy,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AppLayoutProps {
  children?: React.ReactNode;
}

const navigationItems = [
  {
    icon: CheckSquare,
    label: 'Tasks',
    href: '/tasks',
    description: 'Manage your daily tasks'
  },
  {
    icon: Timer,
    label: 'Focus Timer',
    href: '/timer',
    description: 'Pomodoro sessions'
  },
  {
    icon: Lightbulb,
    label: 'Brain Dump',
    href: '/brain-dump',
    description: 'Capture quick thoughts'
  },
  {
    icon: TrendingUp,
    label: 'Progress',
    href: '/progress',
    description: 'Track your achievements'
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
    description: 'Customize your app'
  }
];

export function AppLayout({ children }: AppLayoutProps) {
  const { state } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const progressToNextLevel = ((state.userProgress.totalPoints % 100) / 100) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and App Name */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">FocusFlow</h1>
                  <p className="text-xs text-gray-600">ADHD-Friendly Productivity</p>
                </div>
              </div>
            </div>

            {/* User Progress Indicator */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-900">
                      Level {state.userProgress.level}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress 
                      value={progressToNextLevel} 
                      className="w-20 h-2" 
                    />
                    <span className="text-xs text-gray-600">
                      {state.userProgress.totalPoints % 100}/100
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  {state.userProgress.totalPoints} pts
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white/90 backdrop-blur-md border-r border-blue-100 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Mobile header spacer */}
            <div className="h-16 lg:hidden" />
            
            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Main Navigation
                </h2>
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href);
                        setSidebarOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200",
                        isActive 
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg" 
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 mr-3",
                        isActive ? "text-white" : "text-gray-500"
                      )} />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className={cn(
                          "text-xs",
                          isActive ? "text-blue-100" : "text-gray-500"
                        )}>
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tasks Completed</span>
                    <span className="font-medium text-gray-900">
                      {state.tasks.filter(t => t.status === 'completed' && 
                        new Date(t.completedAt || '').toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Focus Sessions</span>
                    <span className="font-medium text-gray-900">
                      {state.timerSessions.filter(s => 
                        s.type === 'focus' && 
                        new Date(s.completedAt).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="font-medium text-green-600">
                      {state.userProgress.streakDays} days
                    </span>
                  </div>
                </div>
              </div>
            </nav>

            {/* Motivational Message */}
            <div className="p-4 border-t border-blue-100">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl mb-2">🌟</div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  You're doing great!
                </p>
                <p className="text-xs text-gray-600">
                  Every small step counts towards your goals.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="min-h-screen">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
}
