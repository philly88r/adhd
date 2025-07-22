import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, Project, TimerSession, UserProgress, BrainDumpEntry, AppSettings, Achievement } from '@/types';

interface AppState {
  tasks: Task[];
  projects: Project[];
  timerSessions: TimerSession[];
  userProgress: UserProgress;
  brainDumpEntries: BrainDumpEntry[];
  settings: AppSettings;
  currentTimer: {
    isActive: boolean;
    timeLeft: number;
    type: 'focus' | 'short-break' | 'long-break';
    taskId?: string;
  };
}

type AppAction = 
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; updates: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_TIMER_SESSION'; payload: TimerSession }
  | { type: 'UPDATE_USER_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'ADD_BRAIN_DUMP_ENTRY'; payload: BrainDumpEntry }
  | { type: 'UPDATE_BRAIN_DUMP_ENTRY'; payload: { id: string; updates: Partial<BrainDumpEntry> } }
  | { type: 'DELETE_BRAIN_DUMP_ENTRY'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'START_TIMER'; payload: { type: 'focus' | 'short-break' | 'long-break'; duration: number; taskId?: string } }
  | { type: 'STOP_TIMER' }
  | { type: 'TICK_TIMER' }
  | { type: 'COMPLETE_TIMER' }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialAchievements: Achievement[] = [
  {
    id: 'first-task',
    title: 'Getting Started',
    description: 'Complete your first task',
    iconName: 'Trophy',
    requirement: { type: 'tasks_completed', target: 1 }
  },
  {
    id: 'task-master-10',
    title: 'Task Master',
    description: 'Complete 10 tasks',
    iconName: 'Star',
    requirement: { type: 'tasks_completed', target: 10 }
  },
  {
    id: 'focus-warrior-5',
    title: 'Focus Warrior',
    description: 'Complete 5 focus sessions',
    iconName: 'Target',
    requirement: { type: 'focus_sessions', target: 5 }
  },
  {
    id: 'streak-champion',
    title: 'Streak Champion',
    description: 'Maintain a 7-day streak',
    iconName: 'Flame',
    requirement: { type: 'streak_days', target: 7 }
  },
  {
    id: 'project-finisher',
    title: 'Project Finisher',
    description: 'Complete your first project',
    iconName: 'CheckCircle',
    requirement: { type: 'project_completed', target: 1 }
  }
];

const initialState: AppState = {
  tasks: [],
  projects: [],
  timerSessions: [],
  userProgress: {
    totalPoints: 0,
    level: 1,
    streakDays: 0,
    tasksCompleted: 0,
    focusSessionsCompleted: 0,
    achievements: initialAchievements
  },
  brainDumpEntries: [],
  settings: {
    pomodoroMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    theme: 'light',
    notificationsEnabled: true,
    soundEnabled: true,
    passcode: '123456'
  },
  currentTimer: {
    isActive: false,
    timeLeft: 0,
    type: 'focus'
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    case 'UPDATE_TASK': {
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
      );
      
      // Award points and update progress if task is completed
      let newUserProgress = state.userProgress;
      if (action.payload.updates.status === 'completed') {
        const task = state.tasks.find(t => t.id === action.payload.id);
        if (task && task.status !== 'completed') {
          const points = calculateTaskPoints(task);
          newUserProgress = {
            ...state.userProgress,
            totalPoints: state.userProgress.totalPoints + points,
            tasksCompleted: state.userProgress.tasksCompleted + 1,
            level: calculateLevel(state.userProgress.totalPoints + points)
          };
        }
      }

      return {
        ...state,
        tasks: updatedTasks,
        userProgress: newUserProgress
      };
    }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? { ...project, ...action.payload.updates } : project
        )
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        tasks: state.tasks.filter(task => task.projectId !== action.payload)
      };

    case 'ADD_TIMER_SESSION': {
      let newUserProgress = state.userProgress;
      if (action.payload.type === 'focus' && action.payload.wasCompleted) {
        newUserProgress = {
          ...state.userProgress,
          focusSessionsCompleted: state.userProgress.focusSessionsCompleted + 1,
          totalPoints: state.userProgress.totalPoints + 10 // 10 points per completed focus session
        };
      }

      return {
        ...state,
        timerSessions: [...state.timerSessions, action.payload],
        userProgress: newUserProgress
      };
    }

    case 'UPDATE_USER_PROGRESS':
      return {
        ...state,
        userProgress: { ...state.userProgress, ...action.payload }
      };

    case 'ADD_BRAIN_DUMP_ENTRY':
      return {
        ...state,
        brainDumpEntries: [...state.brainDumpEntries, action.payload]
      };

    case 'UPDATE_BRAIN_DUMP_ENTRY':
      return {
        ...state,
        brainDumpEntries: state.brainDumpEntries.map(entry =>
          entry.id === action.payload.id ? { ...entry, ...action.payload.updates } : entry
        )
      };

    case 'DELETE_BRAIN_DUMP_ENTRY':
      return {
        ...state,
        brainDumpEntries: state.brainDumpEntries.filter(entry => entry.id !== action.payload)
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'START_TIMER':
      return {
        ...state,
        currentTimer: {
          isActive: true,
          timeLeft: action.payload.duration * 60, // convert minutes to seconds
          type: action.payload.type,
          taskId: action.payload.taskId
        }
      };

    case 'STOP_TIMER':
      return {
        ...state,
        currentTimer: {
          ...state.currentTimer,
          isActive: false
        }
      };

    case 'TICK_TIMER':
      return {
        ...state,
        currentTimer: {
          ...state.currentTimer,
          timeLeft: Math.max(0, state.currentTimer.timeLeft - 1)
        }
      };

    case 'COMPLETE_TIMER':
      return {
        ...state,
        currentTimer: {
          ...state.currentTimer,
          isActive: false,
          timeLeft: 0
        }
      };

    case 'LOAD_STATE':
      return action.payload;

    default:
      return state;
  }
}

// Helper functions
function calculateTaskPoints(task: Task): number {
  let points = 5; // Base points
  
  if (task.priority === 'high') points += 5;
  else if (task.priority === 'medium') points += 2;
  
  if (task.subtasks.length > 0) points += task.subtasks.length;
  
  return points;
}

function calculateLevel(totalPoints: number): number {
  return Math.floor(totalPoints / 100) + 1;
}

// Context creation
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('adhd-focus-app-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsedState.tasks = parsedState.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
        parsedState.projects = parsedState.projects.map((project: any) => ({
          ...project,
          createdAt: new Date(project.createdAt)
        }));
        parsedState.timerSessions = parsedState.timerSessions.map((session: any) => ({
          ...session,
          completedAt: new Date(session.completedAt)
        }));
        parsedState.brainDumpEntries = parsedState.brainDumpEntries.map((entry: any) => ({
          ...entry,
          createdAt: new Date(entry.createdAt)
        }));
        
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('adhd-focus-app-state', JSON.stringify(state));
  }, [state]);

  // Timer tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.currentTimer.isActive && state.currentTimer.timeLeft > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    } else if (state.currentTimer.isActive && state.currentTimer.timeLeft === 0) {
      dispatch({ type: 'COMPLETE_TIMER' });
      
      // Create timer session record
      const session: TimerSession = {
        id: Date.now().toString(),
        taskId: state.currentTimer.taskId,
        type: state.currentTimer.type,
        duration: state.currentTimer.type === 'focus' ? state.settings.pomodoroMinutes :
                 state.currentTimer.type === 'short-break' ? state.settings.shortBreakMinutes :
                 state.settings.longBreakMinutes,
        completedAt: new Date(),
        wasCompleted: true
      };
      
      dispatch({ type: 'ADD_TIMER_SESSION', payload: session });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.currentTimer.isActive, state.currentTimer.timeLeft, state.currentTimer.type, state.currentTimer.taskId, state.settings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
