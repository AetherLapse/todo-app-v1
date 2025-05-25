
import React from 'react';
import { TodoProvider } from '@/contexts/TodoContext';
import { TodoHeader } from './TodoHeader';
import { TodoSidebar } from './TodoSidebar';
import { TodoMain } from './TodoMain';

export const TodoApp = () => {
  return (
    <TodoProvider>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <TodoSidebar />
        <div className="flex-1 flex flex-col">
          <TodoHeader />
          <TodoMain />
        </div>
      </div>
    </TodoProvider>
  );
};
