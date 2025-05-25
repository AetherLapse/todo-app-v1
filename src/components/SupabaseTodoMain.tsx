
import React from 'react';
import { SupabaseTaskList } from './SupabaseTaskList';
import { SupabaseTaskDetails } from './SupabaseTaskDetails';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';

export const SupabaseTodoMain = () => {
  const { state } = useSupabaseTodo();

  return (
    <div className="flex-1 flex">
      <div className="flex-1">
        <SupabaseTaskList />
      </div>
      {state.selectedTask && (
        <div className="w-96 border-l border-gray-200">
          <SupabaseTaskDetails />
        </div>
      )}
    </div>
  );
};
