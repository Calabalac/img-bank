
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
  const [isValidSession, setIsValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      try {
        console.log('Checking recovery session...');
        
        // Check URL parameters first
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const type = urlParams.get('type');
        
        console.log('URL parameters:', { token: !!token, type });
        
        // If we have recovery parameters in URL, clear them
        if (token && type === 'recovery') {
          console.log('Found recovery token in URL, clearing it');
          window.history.replaceState({}, document.title, '/reset-password');
          
          if (mounted) {
            setIsValidSession(true);
            setCheckingSession(false);
          }
          return;
        }
        
        // Check current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Current session check:', { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          error: error?.message 
        });
        
        if (session?.user && !error) {
          console.log('Valid session found for password reset');
          if (mounted) {
            setIsValidSession(true);
          }
        } else {
          console.log('No valid session, redirecting to auth');
          
          if (mounted) {
            toast({
              title: "Недействительная ссылка",
              description: "Ссылка для восстановления пароля недействительна или устарела. Попробуйте запросить новую ссылку.",
              variant: "destructive",
            });
          }
          
          setTimeout(() => {
            if (mounted) {
              navigate('/auth');
            }
          }, 3000);
        }
      } catch (error) {
        console.error('Error checking recovery session:', error);
        
        if (mounted) {
          toast({
            title: "Ошибка",
            description: "Произошла ошибка при проверке сессии",
            variant: "destructive",
          });
          
          setTimeout(() => {
            navigate('/auth');
          }, 2000);
        }
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    checkRecoverySession();

    return () => {
      mounted = false;
    };
  }, [navigate, toast]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (password.length < 6) {
      toast({
        title: "Короткий пароль",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Пароли не совпадают",
        description: "Пожалуйста, убедитесь, что пароли одинаковые",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Updating password...');
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Password update error:', error);
        throw error;
      }

      console.log('Password updated successfully');
      
      toast({
        title: "Пароль обновлен!",
        description: "Ваш пароль успешно изменен. Перенаправляем на главную страницу...",
      });
      
      // Wait a bit to show the success message
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error: any) {
      console.error('Password update failed:', error);
      
      let errorMessage = "Не удалось обновить пароль";
      
      if (error.message?.includes('New password should be different')) {
        errorMessage = "Новый пароль должен отличаться от текущего";
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = "Пароль должен содержать минимум 6 символов";
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              <p className="text-white">Проверяем ссылку восстановления...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid session state
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="text-white mb-4">Недействительная ссылка восстановления</p>
            <p className="text-slate-300 text-sm mb-4">Перенаправляем на страницу входа...</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form
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
                  placeholder="Минимум 6 символов"
                  required
                  minLength={6}
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
                placeholder="Повторите новый пароль"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={loading}
            >
              {loading ? "Обновляем пароль..." : "Обновить пароль"}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost"
              className="w-full text-white/70 hover:text-white hover:bg-white/10" 
              onClick={() => navigate('/auth')}
              disabled={loading}
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
