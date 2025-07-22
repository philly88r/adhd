import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Target,
  ChevronDown,
  ChevronRight,
  Trash2,
  Edit,
  Play,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function TaskManagement() {
  const { state, dispatch } = useApp();
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const filteredTasks = state.tasks.filter(task => {
    const projectMatch = selectedProject === 'all' || task.projectId === selectedProject;
    const statusMatch = taskFilter === 'all' || task.status === taskFilter;
    return projectMatch && statusMatch;
  });

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const priorityIcons = {
    high: AlertCircle,
    medium: Clock,
    low: Target
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const completeTask = (task: Task) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: {
          status: 'completed',
          completedAt: new Date()
        }
      }
    });
  };

  const startFocusSession = (taskId: string) => {
    dispatch({
      type: 'START_TIMER',
      payload: {
        type: 'focus',
        duration: state.settings.pomodoroMinutes,
        taskId
      }
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Break down your goals into manageable steps</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <NewProjectForm onClose={() => setShowNewProjectDialog(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewTaskDialog} onOpenChange={setShowNewTaskDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <NewTaskForm onClose={() => setShowNewTaskDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Project Filter
              </label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {state.projects.map(project => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Status Filter
              </label>
              <Select value={taskFilter} onValueChange={(value: any) => setTaskFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{state.tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.tasks.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">{state.projects.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600 mb-4">
                Create your first task to get started on your productivity journey!
              </p>
              <Button 
                onClick={() => setShowNewTaskDialog(true)}
                className="bg-gradient-to-r from-blue-500 to-green-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => {
            const PriorityIcon = priorityIcons[task.priority];
            const isExpanded = expandedTasks.has(task.id);
            const completedSubtasks = task.subtasks.filter(st => st.completed).length;
            const progressPercentage = task.subtasks.length > 0 
              ? (completedSubtasks / task.subtasks.length) * 100 
              : 0;

            return (
              <Card key={task.id} className={cn(
                "transition-all duration-200 hover:shadow-md",
                task.status === 'completed' && "bg-green-50 border-green-200"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => {
                        if (task.status !== 'completed') {
                          completeTask(task);
                        }
                      }}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className={cn(
                            "font-medium text-gray-900",
                            task.status === 'completed' && "line-through text-gray-500"
                          )}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600">{task.description}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={priorityColors[task.priority]}>
                            <PriorityIcon className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                          {task.projectId && (
                            <Badge variant="outline">
                              {state.projects.find(p => p.id === task.projectId)?.name}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for Subtasks */}
                      {task.subtasks.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              Progress ({completedSubtasks}/{task.subtasks.length})
                            </span>
                            <span className="text-gray-900 font-medium">
                              {Math.round(progressPercentage)}%
                            </span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        {task.subtasks.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTaskExpansion(task.id)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 mr-1" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-1" />
                            )}
                            {task.subtasks.length} subtasks
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startFocusSession(task.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Focus
                        </Button>
                      </div>

                      {/* Subtasks */}
                      {isExpanded && task.subtasks.length > 0 && (
                        <div className="ml-4 space-y-2 border-l-2 border-gray-100 pl-4">
                          {task.subtasks.map(subtask => (
                            <div key={subtask.id} className="flex items-center space-x-2">
                              <Checkbox
                                checked={subtask.completed}
                                onCheckedChange={(checked) => {
                                  const updatedSubtasks = task.subtasks.map(st =>
                                    st.id === subtask.id ? { ...st, completed: !!checked } : st
                                  );
                                  dispatch({
                                    type: 'UPDATE_TASK',
                                    payload: {
                                      id: task.id,
                                      updates: { subtasks: updatedSubtasks }
                                    }
                                  });
                                }}
                              />
                              <span className={cn(
                                "text-sm",
                                subtask.completed 
                                  ? "line-through text-gray-500" 
                                  : "text-gray-700"
                              )}>
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// New Task Form Component
function NewTaskForm({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [projectId, setProjectId] = useState<string>('none');
  const [subtasks, setSubtasks] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: 'pending',
      projectId: projectId && projectId !== 'none' ? projectId : undefined,
      subtasks: subtasks
        .filter(st => st.trim())
        .map((st, index) => ({
          id: `${Date.now()}-${index}`,
          title: st.trim(),
          completed: false,
          createdAt: new Date()
        })),
      createdAt: new Date(),
      tags: []
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    onClose();
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const updateSubtask = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Task Title *
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details about this task..."
          className="w-full"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Priority
          </label>
          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Project
          </label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger>
              <SelectValue placeholder="Select project..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {state.projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Break it down (Subtasks)
        </label>
        <div className="space-y-2">
          {subtasks.map((subtask, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={subtask}
                onChange={(e) => updateSubtask(index, e.target.value)}
                placeholder={`Step ${index + 1}...`}
                className="flex-1"
              />
              {subtasks.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSubtask(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSubtask}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Step
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500">
          Create Task
        </Button>
      </div>
    </form>
  );
}

// New Project Form Component
function NewProjectForm({ onClose }: { onClose: () => void }) {
  const { dispatch } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      createdAt: new Date(),
      completedTasks: 0,
      totalTasks: 0
    };

    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Project Name *
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name..."
          className="w-full"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project..."
          className="w-full"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-green-500">
          Create Project
        </Button>
      </div>
    </form>
  );
}
