
import React from 'react';
import { TaskList } from './TaskList';
import { TaskDetails } from './TaskDetails';
import { useTodo } from '@/contexts/TodoContext';

export const TodoMain = () => {
  const { state } = useTodo();

  return (
    <div className="flex-1 flex">
      <div className="flex-1">
        <TaskList />
      </div>
      {state.selectedTask && (
        <div className="w-96 border-l border-gray-200">
          <TaskDetails />
        </div>
      )}
    </div>
  );
};
