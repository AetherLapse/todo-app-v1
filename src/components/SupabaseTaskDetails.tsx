
import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Flag, Tag, MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';
import { PriorityBadge } from './PriorityBadge';

export const SupabaseTaskDetails = () => {
  const { 
    state, 
    setSelectedTask, 
    updateTask, 
    deleteTask, 
    createSubtask, 
    updateSubtask, 
    subtasks 
  } = useSupabaseTodo();
  const [newSubtask, setNewSubtask] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(state.selectedTask?.notes || '');

  if (!state.selectedTask) return null;

  const task = state.selectedTask;
  const taskSubtasks = subtasks.filter(s => s.task_id === task.id);

  const handleClose = () => {
    setSelectedTask(null);
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    
    await createSubtask(task.id, newSubtask.trim());
    setNewSubtask('');
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    const subtask = taskSubtasks.find(s => s.id === subtaskId);
    if (subtask) {
      await updateSubtask(subtaskId, { completed: !subtask.completed });
    }
  };

  const handleSaveNotes = async () => {
    await updateTask(task.id, { notes });
    setIsEditingNotes(false);
  };

  const handleDeleteTask = async () => {
    await deleteTask(task.id);
  };

  const completedSubtasks = taskSubtasks.filter(s => s.completed).length;
  const progress = taskSubtasks.length > 0 ? (completedSubtasks / taskSubtasks.length) * 100 : 0;

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-medium text-gray-900">{task.title}</h3>
          
          {task.description && (
            <p className="text-gray-600">{task.description}</p>
          )}

          <div className="flex items-center space-x-2">
            <PriorityBadge priority={task.priority} />
            {task.due_date && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.due_date), 'MMM d, yyyy')}</span>
              </Badge>
            )}
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Subtasks</h4>
            {taskSubtasks.length > 0 && (
              <span className="text-sm text-gray-500">
                {completedSubtasks}/{taskSubtasks.length} completed
              </span>
            )}
          </div>

          {taskSubtasks.length > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {taskSubtasks.map(subtask => (
              <div key={subtask.id} className="flex items-center space-x-2">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => handleToggleSubtask(subtask.id)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="Add a subtask..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddSubtask}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Notes</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setIsEditingNotes(!isEditingNotes);
                if (!isEditingNotes) setNotes(task.notes || '');
              }}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>

          {isEditingNotes ? (
            <div className="space-y-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this task..."
                className="min-h-[100px]"
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSaveNotes}>
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              {task.notes || (
                <span className="italic">No notes yet. Click the edit button to add notes.</span>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Task Meta */}
        <div className="space-y-2 text-sm text-gray-500">
          <div>Created: {format(new Date(task.created_at), 'MMM d, yyyy h:mm a')}</div>
          <div>Updated: {format(new Date(task.updated_at), 'MMM d, yyyy h:mm a')}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={handleDeleteTask}
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Task
        </Button>
      </div>
    </div>
  );
};
