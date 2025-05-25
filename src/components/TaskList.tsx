
import React, { useMemo } from 'react';
import { format, isToday, isPast } from 'date-fns';
import { useTodo } from '@/contexts/TodoContext';
import { TaskItem } from './TaskItem';
import { AddTaskForm } from './AddTaskForm';
import { TaskSort } from './TaskSort';

export const TaskList = () => {
  const { state } = useTodo();

  const filteredAndSortedTasks = useMemo(() => {
    let tasks = state.tasks;

    // Filter by search query
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      tasks = tasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (state.currentCategory !== 'all') {
      tasks = tasks.filter(task => task.category === state.currentCategory);
    }

    // Filter by status
    switch (state.filterBy) {
      case 'active':
        tasks = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        tasks = tasks.filter(task => task.completed);
        break;
      case 'today':
        tasks = tasks.filter(task => task.dueDate && isToday(new Date(task.dueDate)));
        break;
      case 'overdue':
        tasks = tasks.filter(task => 
          task.dueDate && 
          isPast(new Date(task.dueDate)) && 
          !task.completed
        );
        break;
    }

    // Sort tasks
    tasks.sort((a, b) => {
      switch (state.sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return tasks;
  }, [state.tasks, state.searchQuery, state.currentCategory, state.filterBy, state.sortBy]);

  const currentCategoryName = state.categories.find(c => c.id === state.currentCategory)?.name || 'All Tasks';
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
          <TaskSort />
        </div>
        
        {!state.selectedTask && <AddTaskForm />}
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
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};
