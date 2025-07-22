import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BrainDumpEntry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  Lightbulb, 
  Search, 
  Filter, 
  Trash2, 
  Edit,
  CheckCircle,
  Clock,
  Tag,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrainDump() {
  const { state, dispatch } = useApp();
  const [newEntry, setNewEntry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showProcessedOnly, setShowProcessedOnly] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Filter entries based on search and filters
  const filteredEntries = state.brainDumpEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || entry.tags.includes(filterTag);
    const matchesProcessed = !showProcessedOnly || entry.processed;
    
    return matchesSearch && matchesTag && matchesProcessed;
  });

  // Get all unique tags
  const allTags = Array.from(
    new Set(state.brainDumpEntries.flatMap(entry => entry.tags))
  ).sort();

  // Add new brain dump entry
  const addEntry = () => {
    if (!newEntry.trim()) return;

    // Extract hashtags from the content
    const hashtagRegex = /#(\w+)/g;
    const tags = [];
    let match;
    while ((match = hashtagRegex.exec(newEntry)) !== null) {
      tags.push(match[1].toLowerCase());
    }

    const entry: BrainDumpEntry = {
      id: Date.now().toString(),
      content: newEntry.trim(),
      createdAt: new Date(),
      tags,
      processed: false
    };

    dispatch({ type: 'ADD_BRAIN_DUMP_ENTRY', payload: entry });
    setNewEntry('');
    
    // Refocus textarea for quick successive entries
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  // Mark entry as processed
  const markAsProcessed = (entryId: string) => {
    dispatch({
      type: 'UPDATE_BRAIN_DUMP_ENTRY',
      payload: {
        id: entryId,
        updates: { processed: true }
      }
    });
  };

  // Delete entry
  const deleteEntry = (entryId: string) => {
    dispatch({ type: 'DELETE_BRAIN_DUMP_ENTRY', payload: entryId });
  };

  // Convert entry to task
  const convertToTask = (entry: BrainDumpEntry) => {
    // This would create a new task from the brain dump entry
    // For now, we'll mark it as processed
    markAsProcessed(entry.id);
    
    // In a full implementation, you'd dispatch an ADD_TASK action here
    // with the entry content as the task title
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      addEntry();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brain Dump</h1>
          <p className="text-gray-600 mt-1">Capture your thoughts quickly before they slip away</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {state.brainDumpEntries.length} entries
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            {state.brainDumpEntries.filter(e => e.processed).length} processed
          </Badge>
        </div>
      </div>

      {/* Quick Capture */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Quick Capture</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind? Type your thoughts here... (Use #tags to organize)"
              className="min-h-[100px] resize-none border-yellow-200 focus:border-yellow-400"
              rows={4}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                💡 Tip: Use #tags to organize your thoughts. Press Ctrl+Enter to save quickly.
              </p>
              <Button
                onClick={addEntry}
                disabled={!newEntry.trim()}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your thoughts..."
                  className="pl-10"
                />
              </div>
            </div>
            
            {allTags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterTag}
                  onChange={(e) => setFilterTag(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>#{tag}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="processed-filter"
                checked={showProcessedOnly}
                onCheckedChange={(checked) => setShowProcessedOnly(!!checked)}
              />
              <label 
                htmlFor="processed-filter" 
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Processed only
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {state.brainDumpEntries.length === 0 
                  ? "No thoughts captured yet" 
                  : "No entries match your filters"
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {state.brainDumpEntries.length === 0 
                  ? "Start capturing your ideas and thoughts as they come to you!"
                  : "Try adjusting your search terms or filters."
                }
              </p>
              {state.brainDumpEntries.length === 0 && (
                <Button 
                  onClick={() => textareaRef.current?.focus()}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Start Capturing
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEntries
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map(entry => (
              <BrainDumpEntryCard 
                key={entry.id} 
                entry={entry}
                onMarkProcessed={() => markAsProcessed(entry.id)}
                onDelete={() => deleteEntry(entry.id)}
                onConvertToTask={() => convertToTask(entry)}
              />
            ))
        )}
      </div>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>Brain Dump Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">📝 What to capture:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Random ideas and thoughts</li>
                <li>• Things you don't want to forget</li>
                <li>• Sudden inspirations</li>
                <li>• Worries that distract you</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">🏷️ Organization tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use #tags to categorize thoughts</li>
                <li>• #work #personal #idea #todo</li>
                <li>• Process entries regularly</li>
                <li>• Convert important ones to tasks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual Brain Dump Entry Card Component
interface BrainDumpEntryCardProps {
  entry: BrainDumpEntry;
  onMarkProcessed: () => void;
  onDelete: () => void;
  onConvertToTask: () => void;
}

function BrainDumpEntryCard({ 
  entry, 
  onMarkProcessed, 
  onDelete, 
  onConvertToTask 
}: BrainDumpEntryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isLongContent = entry.content.length > 200;
  const displayContent = isExpanded || !isLongContent 
    ? entry.content 
    : entry.content.substring(0, 200) + '...';

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      entry.processed && "bg-green-50 border-green-200"
    )}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with timestamp */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "p-1.5 rounded-lg",
                entry.processed ? "bg-green-100" : "bg-yellow-100"
              )}>
                {entry.processed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  {new Date(entry.createdAt).toLocaleDateString()} at{' '}
                  {new Date(entry.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            
            {entry.processed && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Processed
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
              {displayContent}
            </p>
            
            {isLongContent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {entry.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              {!entry.processed && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkProcessed}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Processed
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onConvertToTask}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ArrowRight className="h-4 w-4 mr-1" />
                    Convert to Task
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
