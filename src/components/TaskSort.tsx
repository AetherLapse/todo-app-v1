
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTodo } from '@/contexts/TodoContext';

export const TaskSort = () => {
  const { state, dispatch } = useTodo();

  return (
    <Select value={state.sortBy} onValueChange={(value: any) => dispatch({ type: 'SET_SORT_BY', payload: value })}>
      <SelectTrigger className="w-40">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="dueDate">Due Date</SelectItem>
        <SelectItem value="priority">Priority</SelectItem>
        <SelectItem value="created">Created</SelectItem>
        <SelectItem value="title">Title</SelectItem>
      </SelectContent>
    </Select>
  );
};
