
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем сессию для токена восстановления пароля
    const checkRecoverySession = async () => {
      try {
        // Сначала проверяем URL параметры
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        
        console.log('Reset password URL params:', { token: !!token, type });
        
        // Если есть токен в URL, пытаемся его обработать
        if (token && type === 'recovery') {
          console.log('Processing recovery token from URL');
          
          // Очищаем URL от параметров
          window.history.replaceState({}, document.title, '/reset-password');
          
          // Устанавливаем токен как действительный
          setIsValidToken(true);
          setCheckingToken(false);
          return;
        }
        
        // Если нет токена в URL, проверяем текущую сессию
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Reset password session check:', { session: !!session, error });
        
        if (session && session.user) {
          // Если есть активная сессия, значит токен восстановления действителен
          setIsValidToken(true);
          console.log('Valid recovery session found');
        } else {
          console.log('No valid session, redirecting to auth');
          toast({
            title: "Недействительная ссылка",
            description: "Ссылка для восстановления пароля недействительна или устарела",
            variant: "destructive",
          });
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error checking recovery session:', error);
        navigate('/auth');
      } finally {
        setCheckingToken(false);
      }
    };

    checkRecoverySession();
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      toast({
        title: "Пароль обновлен!",
        description: "Ваш пароль успешно изменен. Перенаправляем на главную страницу...",
      });
      
      // Небольшая задержка для показа уведомления
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось обновить пароль",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              <p className="text-white">Проверяем ссылку для восстановления пароля...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-white text-center">Недействительная ссылка восстановления. Перенаправляем...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Новый пароль</CardTitle>
          <p className="text-slate-300">Введите новый пароль для вашего аккаунта</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-white">Новый пароль</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white pr-10"
                  required
                  minLength={6}
                  placeholder="Минимум 6 символов"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-white/70 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-white">Подтвердите пароль</Label>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                required
                minLength={6}
                placeholder="Повторите пароль"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? "Обновляем..." : "Обновить пароль"}
            </Button>
            <Button 
              type="button" 
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10" 
              onClick={() => navigate('/auth')}
            >
              Вернуться к входу
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
