
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SupabaseTask {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  due_date: string | null;
  reminder_date: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  attachments: string[];
  notes: string;
  user_id: string;
  assigned_to: string | null;
  shared_with: string[];
}

export interface SupabaseSubtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface SupabaseCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
}

export const useTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<SupabaseTask[]>([]);
  const [subtasks, setSubtasks] = useState<SupabaseSubtask[]>([]);
  const [categories, setCategories] = useState<SupabaseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchSubtasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subtasks')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSubtasks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching subtasks",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchCategories = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createTask = async (taskData: Partial<SupabaseTask>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...taskData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      toast({
        title: "Task created",
        description: "Your new task has been added successfully."
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<SupabaseTask>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => task.id === id ? data : task));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: "Task deleted",
        description: "The task has been removed successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createSubtask = async (taskId: string, title: string) => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .insert([{
          task_id: taskId,
          title,
          completed: false
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSubtasks(prev => [...prev, data]);
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating subtask",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const updateSubtask = async (id: string, updates: Partial<SupabaseSubtask>) => {
    try {
      const { data, error } = await supabase
        .from('subtasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setSubtasks(prev => prev.map(subtask => subtask.id === id ? data : subtask));
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating subtask",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const createCategory = async (name: string, color: string = 'bg-blue-500', icon: string = 'list') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          user_id: user.id,
          name,
          color,
          icon
        }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      toast({
        title: "Category created",
        description: "Your new category has been added successfully."
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([fetchTasks(), fetchSubtasks(), fetchCategories()])
        .finally(() => setLoading(false));
    } else {
      setTasks([]);
      setSubtasks([]);
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  return {
    tasks,
    subtasks,
    categories,
    loading,
    createTask,
    updateTask,
    deleteTask,
    createSubtask,
    updateSubtask,
    createCategory,
    refetch: () => {
      fetchTasks();
      fetchSubtasks();
      fetchCategories();
    }
  };
};
