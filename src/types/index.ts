// Core data types for the ADHD productivity app

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  projectId?: string;
  subtasks: Subtask[];
  estimatedMinutes?: number;
  actualMinutes?: number;
  createdAt: Date;
  completedAt?: Date;
  tags: string[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  completedTasks: number;
  totalTasks: number;
}

export interface TimerSession {
  id: string;
  taskId?: string;
  type: 'focus' | 'short-break' | 'long-break';
  duration: number; // in minutes
  completedAt: Date;
  wasCompleted: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  earnedAt?: Date;
  requirement: {
    type: 'tasks_completed' | 'focus_sessions' | 'streak_days' | 'project_completed';
    target: number;
  };
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  streakDays: number;
  lastActiveDate?: Date;
  tasksCompleted: number;
  focusSessionsCompleted: number;
  achievements: Achievement[];
}

export interface BrainDumpEntry {
  id: string;
  content: string;
  createdAt: Date;
  tags: string[];
  processed: boolean;
}

export interface AppSettings {
  pomodoroMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  passcode: string;
}
