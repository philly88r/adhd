import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
// @ts-ignore - Ignore missing type declarations for lucide-react
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Coffee, 
  Brain,
  Settings,
  CheckCircle,
  Target,
  Timer as TimerIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

type TimerType = "focus" | "short-break" | "long-break";

export function PomodoroTimer() {
  const { state, dispatch } = useApp();
  const [selectedTask, setSelectedTask] = useState<string>('none');
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const { currentTimer, settings } = state;
  const pendingTasks = state.tasks.filter(task => task.status !== 'completed');

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get timer duration based on type
  const getTimerDuration = (type: TimerType) => {
    switch (type) {
      case 'focus':
        return settings.pomodoroMinutes;
      case 'short-break':
        return settings.shortBreakMinutes;
      case 'long-break':
        return settings.longBreakMinutes;
    }
  };

  // Start timer
  const startTimer = (type: TimerType, taskId?: string) => {
    const duration = getTimerDuration(type);
    dispatch({
      type: 'START_TIMER',
      payload: { type, duration, taskId }
    });
  };

  // Stop timer
  const stopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
  };

  // Calculate progress percentage
  const totalDuration = getTimerDuration(currentTimer.type) * 60;
  const progress = totalDuration > 0 ? ((totalDuration - currentTimer.timeLeft) / totalDuration) * 100 : 0;

  // Track if timer completion has been handled
  const [completionHandled, setCompletionHandled] = useState(false);

  // Handle timer completion
  useEffect(() => {
    // Only handle completion once when timer reaches 0 and is not active
    if (currentTimer.timeLeft === 0 && !currentTimer.isActive && !completionHandled) {
      // Mark as handled to prevent infinite loop
      setCompletionHandled(true);
      
      if (currentTimer.type === 'focus') {
        setCompletedSessions(prev => prev + 1);
        // Show celebration and suggest break
        setTimeout(() => {
          const shouldTakeLongBreak = (completedSessions + 1) % 4 === 0;
          const nextBreakType = shouldTakeLongBreak ? 'long-break' : 'short-break';
          
          // Auto-start break if user prefers
          if (window.confirm(`🎉 Great focus session! Ready for a ${shouldTakeLongBreak ? 'long' : 'short'} break?`)) {
            startTimer(nextBreakType);
            // Reset completion handled flag when starting a new timer
            setCompletionHandled(false);
          }
        }, 1000);
      } else {
        // Break completed, ask if ready for next focus session
        setTimeout(() => {
          if (window.confirm('Break time over! Ready to focus again? 💪')) {
            startTimer('focus', selectedTask === 'none' ? undefined : selectedTask);
            // Reset completion handled flag when starting a new timer
            setCompletionHandled(false);
          }
        }, 1000);
      }
    }
  }, [currentTimer.timeLeft, currentTimer.isActive, currentTimer.type, completedSessions, selectedTask, completionHandled]);
  
  // Reset completion handled flag when timer is manually started
  useEffect(() => {
    if (currentTimer.isActive && completionHandled) {
      setCompletionHandled(false);
    }
  }, [currentTimer.isActive, completionHandled]);

  const timerTypeConfig = {
    focus: {
      title: 'Focus Time',
      description: 'Deep work session',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    'short-break': {
      title: 'Short Break',
      description: 'Quick recharge',
      icon: Coffee,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    'long-break': {
      title: 'Long Break',
      description: 'Extended rest',
      icon: Coffee,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  };

  const currentConfig = timerTypeConfig[currentTimer.type];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Focus Timer</h1>
          <p className="text-gray-600 mt-1">Use the Pomodoro Technique to boost your productivity</p>
        </div>
        <Button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white border border-gray-200 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <TimerSettings />
          </CardContent>
        </Card>
      )}

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.timerSessions.filter(s => 
                    s.type === 'focus' && 
                    s.wasCompleted &&
                    new Date(s.completedAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TimerIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Cycle</p>
                <p className="text-2xl font-bold text-gray-900">
                  {completedSessions % 4 + 1}/4
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Timer */}
      <div className="max-w-2xl mx-auto">
        <Card className={cn("transition-all duration-300", currentConfig.bgColor)}>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Timer Type Badge */}
              <div className="flex justify-center">
                <Badge className={cn("px-4 py-2 text-sm font-medium", currentConfig.textColor)}>
                  <CurrentIcon className="h-4 w-4 mr-2" />
                  {currentConfig.title}
                </Badge>
              </div>

              {/* Time Display */}
              <div className="space-y-2">
                <div className={cn("text-6xl md:text-8xl font-mono font-bold", currentConfig.textColor)}>
                  {formatTime(currentTimer.timeLeft)}
                </div>
                <p className="text-gray-600">{currentConfig.description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress 
                  value={progress} 
                  className="h-3 w-full"
                />
                <p className="text-sm text-gray-600">
                  {Math.round(progress)}% complete
                </p>
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!currentTimer.isActive ? (
                  <>
                    <Button
                      onClick={() => startTimer("focus", selectedTask === "none" ? undefined : selectedTask)}
                      className={cn(
                        "bg-gradient-to-r text-white shadow-lg h-10 rounded-md px-8",
                        currentConfig.color
                      )}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Focus
                    </Button>
                    <Button
                      onClick={() => startTimer("short-break")}
                      className="border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 h-10 rounded-md px-8"
                    >
                      <Coffee className="h-5 w-5 mr-2" />
                      Short Break
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={stopTimer}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white h-10 rounded-md px-8"
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                    <Button
                      onClick={() => {
                        stopTimer();
                        startTimer(currentTimer.type, currentTimer.taskId);
                      }}
                      className="border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900 h-10 rounded-md px-8"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
              </div>

              {/* Task Selection */}
              {currentTimer.type === 'focus' && pendingTasks.length > 0 && (
                <div className="max-w-md mx-auto">
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Focus on a specific task (optional)
                  </label>
                  <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a task to focus on..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No specific task</SelectItem>
                      {pendingTasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Current Task Display */}
              {currentTimer.taskId && (
                <div className="bg-white/80 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-600 mb-1">Currently focusing on:</p>
                  <p className="font-medium text-gray-900">
                    {state.tasks.find(t => t.id === currentTimer.taskId)?.title}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => startTimer("focus")}
                className="h-20 flex flex-col items-center justify-center space-y-2 border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Brain className="h-6 w-6 text-blue-600" />
                <span>Focus Session</span>
                <span className="text-xs text-gray-500">{settings.pomodoroMinutes} min</span>
              </Button>
              
              <Button
                onClick={() => startTimer("short-break")}
                className="h-20 flex flex-col items-center justify-center space-y-2 border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Coffee className="h-6 w-6 text-green-600" />
                <span>Short Break</span>
                <span className="text-xs text-gray-500">{settings.shortBreakMinutes} min</span>
              </Button>
              
              <Button
                onClick={() => startTimer("long-break")}
                className="h-20 flex flex-col items-center justify-center space-y-2 border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 hover:text-zinc-900"
              >
                <Coffee className="h-6 w-6 text-purple-600" />
                <span>Long Break</span>
                <span className="text-xs text-gray-500">{settings.longBreakMinutes} min</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentSessions />
        </CardContent>
      </Card>
    </div>
  );
}

// Timer Settings Component
function TimerSettings() {
  const { state, dispatch } = useApp();
  const [focusMinutes, setFocusMinutes] = useState(state.settings.pomodoroMinutes);
  const [shortBreakMinutes, setShortBreakMinutes] = useState(state.settings.shortBreakMinutes);
  const [longBreakMinutes, setLongBreakMinutes] = useState(state.settings.longBreakMinutes);

  const saveSettings = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        pomodoroMinutes: focusMinutes,
        shortBreakMinutes: shortBreakMinutes,
        longBreakMinutes: longBreakMinutes
      }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Focus Duration (minutes)
        </label>
        <Select
          value={focusMinutes.toString()}
          onValueChange={(value) => setFocusMinutes(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="25">25 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
            <SelectItem value="50">50 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Short Break (minutes)
        </label>
        <Select
          value={shortBreakMinutes.toString()}
          onValueChange={(value) => setShortBreakMinutes(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="15">15 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Long Break (minutes)
        </label>
        <Select
          value={longBreakMinutes.toString()}
          onValueChange={(value) => setLongBreakMinutes(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="20">20 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="45">45 minutes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="md:col-span-3 pt-4">
        <Button onClick={saveSettings} className="bg-gradient-to-r from-blue-500 to-green-500">
          Save Settings
        </Button>
      </div>
    </div>
  );
}

// Recent Sessions Component
function RecentSessions() {
  const { state } = useApp();
  
  const recentSessions = state.timerSessions
    .slice(-5)
    .reverse()
    .map(session => {
      const task = session.taskId ? state.tasks.find(t => t.id === session.taskId) : null;
      return { ...session, task };
    });

  if (recentSessions.length === 0) {
    return (
      <div className="text-center py-8">
        <TimerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No sessions yet. Start your first focus session!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentSessions.map(session => (
        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              session.type === 'focus' ? "bg-blue-100" : "bg-green-100"
            )}>
              {session.type === 'focus' ? (
                <Brain className="h-4 w-4 text-blue-600" />
              ) : (
                <Coffee className="h-4 w-4 text-green-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {session.type === 'focus' ? 'Focus Session' : 
                 session.type === 'short-break' ? 'Short Break' : 'Long Break'}
              </p>
              {session.task && (
                <p className="text-sm text-gray-600">{session.task.title}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {session.duration} min
            </p>
            <p className="text-xs text-gray-500">
              {new Date(session.completedAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
