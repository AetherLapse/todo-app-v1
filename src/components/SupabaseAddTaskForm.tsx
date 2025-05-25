
import React, { useState } from 'react';
import { Plus, Calendar, Tag, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useSupabaseTodo } from '@/contexts/SupabaseTodoContext';
import { format } from 'date-fns';

export const SupabaseAddTaskForm = () => {
  const { state, categories, createTask } = useSupabaseTodo();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [category, setCategory] = useState(state.currentCategory !== 'all' ? state.currentCategory : categories[0]?.id || 'personal');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createTask({
      title: title.trim(),
      description: description.trim() || null,
      completed: false,
      priority,
      category,
      due_date: dueDate?.toISOString() || null,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      attachments: [],
      notes: ''
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setTags('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <div className="mb-6">
        <Button
          variant="outline"
          className="w-full justify-start text-gray-500 border-dashed hover:border-solid hover:text-gray-700"
          onClick={() => setIsExpanded(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a new task...
        </Button>
      </div>
    );
  }

  const availableCategories = categories.filter(c => c.id !== 'all');

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-4">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium border-none p-0 focus-visible:ring-0"
          autoFocus
        />

        <Textarea
          placeholder="Add a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] border-none p-0 focus-visible:ring-0 resize-none"
        />

        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {dueDate ? format(dueDate, 'MMM d') : 'Due date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
            <SelectTrigger className="w-32">
              <Flag className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border-none p-0 focus-visible:ring-0"
        />

        <div className="flex items-center justify-between pt-2">
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </Button>
          
          <Button 
            type="submit" 
            size="sm"
            disabled={!title.trim()}
          >
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
};
