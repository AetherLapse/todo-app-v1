
import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';

export const SupabaseTaskSort = () => {
  const { state, setSortBy } = useSupabaseTodo();

  return (
    <Select value={state.sortBy} onValueChange={(value: any) => setSortBy(value)}>
      <SelectTrigger className="w-40">
        <ArrowUpDown className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="due_date">Due Date</SelectItem>
        <SelectItem value="priority">Priority</SelectItem>
        <SelectItem value="created_at">Created</SelectItem>
        <SelectItem value="title">Title</SelectItem>
      </SelectContent>
    </Select>
  );
};
