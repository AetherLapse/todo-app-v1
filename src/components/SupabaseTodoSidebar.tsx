import React, { useState } from 'react';
import { Plus, List, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';
import { AddCategoryDialog } from './AddCategoryDialog';
import { format, isToday, isPast } from 'date-fns';

export const SupabaseTodoSidebar = () => {
  const { 
    state, 
    tasks, 
    categories, 
    setFilterBy, 
    setCurrentCategory, 
    setSelectedTask 
  } = useSupabaseTodo();
  const [showAddCategory, setShowAddCategory] = useState(false);

  const getTaskCount = (categoryId: string, filter?: string) => {
    let filteredTasks = tasks;
    
    if (categoryId !== 'all') {
      filteredTasks = tasks.filter(task => task.category === categoryId);
    }
    
    switch (filter) {
      case 'active':
        return filteredTasks.filter(task => !task.completed).length;
      case 'completed':
        return filteredTasks.filter(task => task.completed).length;
      case 'today':
        return filteredTasks.filter(task => 
          task.due_date && isToday(new Date(task.due_date))
        ).length;
      case 'overdue':
        return filteredTasks.filter(task => 
          task.due_date && 
          isPast(new Date(task.due_date)) && 
          !task.completed
        ).length;
      default:
        return filteredTasks.length;
    }
  };

  const quickFilters = [
    { id: 'today', name: 'Today', icon: Calendar, count: getTaskCount('all', 'today') },
    { id: 'active', name: 'Active', icon: Clock, count: getTaskCount('all', 'active') },
    { id: 'overdue', name: 'Overdue', icon: AlertTriangle, count: getTaskCount('all', 'overdue') },
    { id: 'completed', name: 'Completed', icon: CheckCircle, count: getTaskCount('all', 'completed') }
  ];

  const allCategories = [
    { id: 'all', name: 'All Tasks', color: 'bg-gray-500', icon: 'list' },
    ...categories
  ];

  const handleAddTaskClick = () => {
    // Reset selected task to null to show the add task form
    setSelectedTask(null);
    // Reset filter to show all tasks
    setFilterBy('all');
  };

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          <Button 
            size="sm" 
            onClick={handleAddTaskClick}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Filters</h3>
          <div className="space-y-1">
            {quickFilters.map(filter => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setFilterBy(filter.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                    state.filterBy === filter.id 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {filter.name}
                  </div>
                  {filter.count > 0 && (
                    <Badge 
                      variant={state.filterBy === filter.id ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {filter.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAddCategory(true)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {allCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  state.currentCategory === category.id 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`} />
                  {category.name}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getTaskCount(category.id)}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        <AddCategoryDialog 
          open={showAddCategory} 
          onOpenChange={setShowAddCategory}
        />
      </div>
    </aside>
  );
};
