
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
}

export const UsersList = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список пользователей',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user' | 'moderator') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: 'Роль обновлена',
        description: `Пользователю назначена роль ${newRole}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить роль пользователя',
        variant: 'destructive',
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'moderator': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Пользователи системы
          <Badge variant="secondary" className="ml-auto">
            {users.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    {user.username || 'Без имени'}
                  </h3>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                    {user.role}
                  </Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status === 'active' ? <UserCheck className="w-3 h-3 mr-1" /> : <UserX className="w-3 h-3 mr-1" />}
                    {user.status}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{user.email}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Регистрация: {new Date(user.created_at).toLocaleDateString('ru-RU')}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {user.role !== 'admin' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'admin')}
                    className="text-xs"
                  >
                    Сделать админом
                  </Button>
                )}
                {user.role !== 'moderator' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'moderator')}
                    className="text-xs"
                  >
                    Модератор
                  </Button>
                )}
                {user.role !== 'user' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateUserRole(user.id, 'user')}
                    className="text-xs"
                  >
                    Обычный
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
