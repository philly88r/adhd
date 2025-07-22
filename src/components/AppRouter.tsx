import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './Layout/AppLayout';
import { Dashboard } from './Dashboard/Dashboard';
import { TaskManagement } from './Tasks/TaskManagement';
import { PomodoroTimer } from './Timer/PomodoroTimer';
import { BrainDump } from './BrainDump/BrainDump';
import { ProgressDashboard } from './Progress/ProgressDashboard';
import { SettingsPage } from './Settings/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<TaskManagement />} />
        <Route path="timer" element={<PomodoroTimer />} />
        <Route path="brain-dump" element={<BrainDump />} />
        <Route path="progress" element={<ProgressDashboard />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
