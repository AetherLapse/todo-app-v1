
import React from 'react';
import { format, isToday, isPast } from 'date-fns';
import { Calendar, Clock, AlertTriangle, MessageSquare, Paperclip, CheckCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';
import { SupabaseTask } from '@/hooks/useTasks';
import { PriorityBadge } from './PriorityBadge';

interface SupabaseTaskItemProps {
  task: SupabaseTask;
}

export const SupabaseTaskItem = ({ task }: SupabaseTaskItemProps) => {
  const { state, setSelectedTask, updateTask, subtasks } = useSupabaseTodo();

  const handleToggle = () => {
    updateTask(task.id, { completed: !task.completed });
  };

  const handleSelect = () => {
    setSelectedTask(task);
  };

  const isOverdue = task.due_date && isPast(new Date(task.due_date)) && !task.completed;
  const isDueToday = task.due_date && isToday(new Date(task.due_date));
  const taskSubtasks = subtasks.filter(s => s.task_id === task.id);
  const completedSubtasks = taskSubtasks.filter(s => s.completed).length;
  const totalSubtasks = taskSubtasks.length;

  return (
    <div 
      className={`group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer ${
        state.selectedTask?.id === task.id ? 'ring-2 ring-blue-500 border-blue-300' : ''
      } ${task.completed ? 'opacity-75' : ''}`}
      onClick={handleSelect}
    >
      <div className="flex items-start space-x-3">
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <div className="flex items-center space-x-2">
              <PriorityBadge priority={task.priority} />
              {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
            </div>
          </div>

          {task.description && (
            <p className={`text-sm mb-2 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {task.description}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {task.due_date && (
                <div className={`flex items-center space-x-1 ${
                  isOverdue ? 'text-red-600' : isDueToday ? 'text-orange-600' : ''
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.due_date), 'MMM d')}</span>
                </div>
              )}

              {totalSubtasks > 0 && (
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>{completedSubtasks}/{totalSubtasks}</span>
                </div>
              )}

              {task.notes && (
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                </div>
              )}

              {task.attachments.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Paperclip className="h-3 w-3" />
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              {task.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {task.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{task.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
