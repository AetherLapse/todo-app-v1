
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  attachments: string[];
  subtasks: Subtask[];
  assignedTo?: string;
  notes: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface TodoState {
  tasks: Task[];
  categories: Category[];
  currentCategory: string;
  searchQuery: string;
  sortBy: 'dueDate' | 'priority' | 'created' | 'title';
  filterBy: 'all' | 'active' | 'completed' | 'today' | 'overdue';
  selectedTask: Task | null;
}

type TodoAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_CURRENT_CATEGORY'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SORT_BY'; payload: TodoState['sortBy'] }
  | { type: 'SET_FILTER_BY'; payload: TodoState['filterBy'] }
  | { type: 'SET_SELECTED_TASK'; payload: Task | null }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id'> }
  | { type: 'ADD_SUBTASK'; payload: { taskId: string; subtask: Omit<Subtask, 'id'> } }
  | { type: 'TOGGLE_SUBTASK'; payload: { taskId: string; subtaskId: string } };

const initialState: TodoState = {
  tasks: [
    {
      id: '1',
      title: 'Welcome to Your Todo App!',
      description: 'This is your first task. You can edit, complete, or delete it.',
      completed: false,
      priority: 'medium',
      category: 'personal',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['welcome', 'tutorial'],
      attachments: [],
      subtasks: [
        { id: '1', title: 'Explore the interface', completed: true },
        { id: '2', title: 'Create your first task', completed: false }
      ],
      notes: 'This is a sample note. You can add detailed information about your tasks here.'
    },
    {
      id: '2',
      title: 'Plan weekly meeting',
      description: 'Prepare agenda and send invites',
      completed: false,
      priority: 'high',
      category: 'work',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['meeting', 'planning'],
      attachments: [],
      subtasks: [],
      notes: ''
    }
  ],
  categories: [
    { id: 'all', name: 'All Tasks', color: 'bg-gray-500', icon: 'list' },
    { id: 'personal', name: 'Personal', color: 'bg-blue-500', icon: 'personal' },
    { id: 'work', name: 'Work', color: 'bg-green-500', icon: 'work' },
    { id: 'shopping', name: 'Shopping', color: 'bg-purple-500', icon: 'shopping' },
    { id: 'health', name: 'Health', color: 'bg-red-500', icon: 'health' }
  ],
  currentCategory: 'all',
  searchQuery: '',
  sortBy: 'dueDate',
  filterBy: 'all',
  selectedTask: null
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask]
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        selectedTask: state.selectedTask?.id === action.payload ? null : state.selectedTask
      };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date() }
            : task
        )
      };

    case 'SET_CURRENT_CATEGORY':
      return { ...state, currentCategory: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };

    case 'SET_FILTER_BY':
      return { ...state, filterBy: action.payload };

    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.payload };

    case 'ADD_CATEGORY':
      const newCategory: Category = {
        ...action.payload,
        id: Date.now().toString()
      };
      return {
        ...state,
        categories: [...state.categories, newCategory]
      };

    case 'ADD_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subtasks: [...task.subtasks, { ...action.payload.subtask, id: Date.now().toString() }],
                updatedAt: new Date()
              }
            : task
        )
      };

    case 'TOGGLE_SUBTASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subtasks: task.subtasks.map(subtask =>
                  subtask.id === action.payload.subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask
                ),
                updatedAt: new Date()
              }
            : task
        )
      };

    default:
      return state;
  }
}

interface TodoContextType {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
