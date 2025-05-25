
import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Calendar, Flag, Tag, MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTodo } from '@/contexts/TodoContext';
import { PriorityBadge } from './PriorityBadge';

export const TaskDetails = () => {
  const { state, dispatch } = useTodo();
  const [newSubtask, setNewSubtask] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(state.selectedTask?.notes || '');

  if (!state.selectedTask) return null;

  const task = state.selectedTask;

  const handleClose = () => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: null });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    
    dispatch({
      type: 'ADD_SUBTASK',
      payload: {
        taskId: task.id,
        subtask: {
          title: newSubtask.trim(),
          completed: false
        }
      }
    });
    setNewSubtask('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    dispatch({
      type: 'TOGGLE_SUBTASK',
      payload: {
        taskId: task.id,
        subtaskId
      }
    });
  };

  const handleSaveNotes = () => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        updates: { notes }
      }
    });
    setIsEditingNotes(false);
  };

  const handleDeleteTask = () => {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
  };

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;
  const progress = task.subtasks.length > 0 ? (completedSubtasks / task.subtasks.length) * 100 : 0;

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
            {task.dueDate && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
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
            {task.subtasks.length > 0 && (
              <span className="text-sm text-gray-500">
                {completedSubtasks}/{task.subtasks.length} completed
              </span>
            )}
          </div>

          {task.subtasks.length > 0 && (
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
            {task.subtasks.map(subtask => (
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
          <div>Created: {format(new Date(task.createdAt), 'MMM d, yyyy h:mm a')}</div>
          <div>Updated: {format(new Date(task.updatedAt), 'MMM d, yyyy h:mm a')}</div>
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
