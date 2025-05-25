
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useTasks, SupabaseTask, SupabaseSubtask, SupabaseCategory } from '@/hooks/useTasks';

interface SupabaseTodoState {
  selectedTask: SupabaseTask | null;
  currentCategory: string;
  searchQuery: string;
  sortBy: 'due_date' | 'priority' | 'created_at' | 'title';
  filterBy: 'all' | 'active' | 'completed' | 'today' | 'overdue';
}

interface SupabaseTodoContextType {
  state: SupabaseTodoState;
  tasks: SupabaseTask[];
  subtasks: SupabaseSubtask[];
  categories: SupabaseCategory[];
  loading: boolean;
  setSelectedTask: (task: SupabaseTask | null) => void;
  setCurrentCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SupabaseTodoState['sortBy']) => void;
  setFilterBy: (filter: SupabaseTodoState['filterBy']) => void;
  createTask: (taskData: Partial<SupabaseTask>) => Promise<SupabaseTask | undefined>;
  updateTask: (id: string, updates: Partial<SupabaseTask>) => Promise<SupabaseTask | undefined>;
  deleteTask: (id: string) => Promise<void>;
  createSubtask: (taskId: string, title: string) => Promise<SupabaseSubtask | undefined>;
  updateSubtask: (id: string, updates: Partial<SupabaseSubtask>) => Promise<SupabaseSubtask | undefined>;
  createCategory: (name: string, color?: string, icon?: string) => Promise<SupabaseCategory | undefined>;
}

const SupabaseTodoContext = createContext<SupabaseTodoContextType | undefined>(undefined);

export const SupabaseTodoProvider = ({ children }: { children: ReactNode }) => {
  const {
    tasks,
    subtasks,
    categories,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    createCategory
  } = useTasks();

  const [state, setState] = useState<SupabaseTodoState>({
    selectedTask: null,
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'due_date',
    filterBy: 'all'
  });

  const setSelectedTask = (task: SupabaseTask | null) => {
    setState(prev => ({ ...prev, selectedTask: task }));
  };

  const setCurrentCategory = (category: string) => {
    setState(prev => ({ ...prev, currentCategory: category }));
  };

  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const setSortBy = (sort: SupabaseTodoState['sortBy']) => {
    setState(prev => ({ ...prev, sortBy: sort }));
  };

  const setFilterBy = (filter: SupabaseTodoState['filterBy']) => {
    setState(prev => ({ ...prev, filterBy: filter }));
  };

  return (
    <SupabaseTodoContext.Provider value={{
      state,
      tasks,
      subtasks,
      categories,
      loading,
      setSelectedTask,
      setCurrentCategory,
      setSearchQuery,
      setSortBy,
      setFilterBy,
      createTask,
      updateTask,
      deleteTask,
      createSubtask,
      updateSubtask,
      createCategory
    }}>
      {children}
    </SupabaseTodoContext.Provider>
  );
};

export const useSupabaseTodo = () => {
  const context = useContext(SupabaseTodoContext);
  if (context === undefined) {
    throw new Error('useSupabaseTodo must be used within a SupabaseTodoProvider');
  }
  return context;
};
