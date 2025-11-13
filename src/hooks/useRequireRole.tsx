import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AppRole = 'student' | 'teacher' | 'admin';

export const useRequireRole = (requiredRole: AppRole) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        setIsLoading(false);
        return;
      }
      
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error || !roles || roles.length === 0) {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access this page.',
          variant: 'destructive'
        });
        navigate('/dashboard');
        setIsLoading(false);
        return;
      }
      
      const hasRole = roles.some((r: any) => r.role === requiredRole || r.role === 'admin');
      
      if (!hasRole) {
        toast({
          title: 'Access Denied',
          description: `This page requires ${requiredRole} privileges.`,
          variant: 'destructive'
        });
        navigate('/dashboard');
        setIsLoading(false);
        return;
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };
    
    checkRole();
  }, [requiredRole, navigate, toast]);
  
  return { isAuthorized, isLoading };
};
