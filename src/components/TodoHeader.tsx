
import React from 'react';
import { Search, Bell, Calendar, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTodo } from '@/contexts/TodoContext';

export const TodoHeader = () => {
  const { state, dispatch } = useTodo();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const completedToday = state.tasks.filter(task => 
    task.completed && 
    new Date(task.updatedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning! 👋</h1>
          <p className="text-gray-600">{today}</p>
          {completedToday > 0 && (
            <p className="text-sm text-green-600 mt-1">
              🎉 You've completed {completedToday} task{completedToday > 1 ? 's' : ''} today!
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={state.searchQuery}
              onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
