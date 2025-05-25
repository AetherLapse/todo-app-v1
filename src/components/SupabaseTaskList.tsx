
import React, { useMemo } from 'react';
import { format, isToday, isPast } from 'date-fns';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';
import { SupabaseTaskItem } from './SupabaseTaskItem';
import { SupabaseAddTaskForm } from './SupabaseAddTaskForm';
import { SupabaseTaskSort } from './SupabaseTaskSort';

export const SupabaseTaskList = () => {
  const { state, tasks, categories } = useSupabaseTodo();

  const filteredAndSortedTasks = useMemo(() => {
    let filteredTasks = tasks;

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (state.currentCategory !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.category === state.currentCategory);
    }

    // Filter by status
    switch (state.filterBy) {
      case 'active':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      case 'today':
        filteredTasks = filteredTasks.filter(task => task.due_date && isToday(new Date(task.due_date)));
        break;
      case 'overdue':
        filteredTasks = filteredTasks.filter(task => 
          task.due_date && 
          isPast(new Date(task.due_date)) && 
          !task.completed
        );
        break;
    }

    // Sort tasks
    filteredTasks.sort((a, b) => {
      switch (state.sortBy) {
        case 'due_date':
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filteredTasks;
  }, [tasks, state.searchQuery, state.currentCategory, state.filterBy, state.sortBy]);

  const currentCategoryName = categories.find(c => c.id === state.currentCategory)?.name || 'All Tasks';
  const activeCount = filteredAndSortedTasks.filter(task => !task.completed).length;
  const completedCount = filteredAndSortedTasks.filter(task => task.completed).length;

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{currentCategoryName}</h2>
            <p className="text-gray-600">
              {activeCount} active, {completedCount} completed
            </p>
          </div>
          <SupabaseTaskSort />
        </div>
        
        {!state.selectedTask && <SupabaseAddTaskForm />}
      </div>

      <div className="space-y-2">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No tasks found</div>
            <p className="text-gray-500">
              {state.searchQuery 
                ? 'Try adjusting your search query' 
                : 'Create your first task to get started!'}
            </p>
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <SupabaseTaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};
