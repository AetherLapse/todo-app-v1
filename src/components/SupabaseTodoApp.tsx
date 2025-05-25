
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SupabaseTodoProvider } from '@/contexts/SupabaseTodoContext';
import { SupabaseTodoHeader } from './SupabaseTodoHeader';
import { SupabaseTodoSidebar } from './SupabaseTodoSidebar';
import { SupabaseTodoMain } from './SupabaseTodoMain';
import { Loader2 } from 'lucide-react';

export const SupabaseTodoApp = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SupabaseTodoProvider>
      <div className="min-h-screen flex flex-col lg:flex-row">
        <SupabaseTodoSidebar />
        <div className="flex-1 flex flex-col">
          <SupabaseTodoHeader />
          <SupabaseTodoMain />
        </div>
      </div>
    </SupabaseTodoProvider>
  );
};
