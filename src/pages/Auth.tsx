
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  
  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      console.log('User already authenticated, redirecting to home');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Неверный email",
        description: "Пожалуйста, введите корректный email адрес",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePassword(password)) {
      toast({
        title: "Короткий пароль",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      
      toast({
        title: "Добро пожаловать!",
        description: "Вход выполнен успешно",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      let errorMessage = "Проверьте email и пароль";
      
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Неверный email или пароль";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Подтвердите email перед входом";
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = "Слишком много попыток. Попробуйте позже";
      }
      
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Требуется имя пользователя",
        description: "Пожалуйста, введите имя пользователя",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateEmail(email)) {
      toast({
        title: "Неверный email",
        description: "Пожалуйста, введите корректный email адрес",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePassword(password)) {
      toast({
        title: "Короткий пароль",
        description: "Пароль должен содержать минимум 6 символов",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, username);
      
      toast({
        title: "Регистрация успешна!",
        description: "Проверьте email для подтверждения аккаунта",
      });
      
      // Switch to sign in tab
      setActiveTab('signin');
      setPassword('');
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      let errorMessage = "Попробуйте еще раз";
      
      if (error.message?.includes('User already registered')) {
        errorMessage = "Пользователь с таким email уже существует";
        setActiveTab('signin');
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = "Пароль должен содержать минимум 6 символов";
      } else if (error.message?.includes('Signup is disabled')) {
        errorMessage = "Регистрация временно отключена";
      }
      
      toast({
        title: "Ошибка регистрации",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: "Неверный email",
        description: "Пожалуйста, введите корректный email адрес",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      
      toast({
        title: "Письмо отправлено!",
        description: "Проверьте email для восстановления пароля",
      });
      
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      toast({
        title: "Ошибка",
        description: "Не удалось отправить письмо. Попробуйте позже",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardContent className="flex items-center justify-center p-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              <p className="text-white">Загрузка...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Восстановление пароля</CardTitle>
            <p className="text-slate-300">Введите ваш email для получения инструкций</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-white">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? "Отправляем..." : "Отправить инструкции"}
              </Button>
              <Button 
                type="button" 
                variant="ghost"
                className="w-full text-white hover:bg-white/10" 
                onClick={() => setShowForgotPassword(false)}
              >
                Назад к входу
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Image Hub</CardTitle>
          <p className="text-slate-300">Добро пожаловать</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">
                Вход
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                Регистрация
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-white">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-white">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white pr-10"
                      placeholder="Минимум 6 символов"
                      required
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={loading}
                >
                  {loading ? "Входим..." : "Войти"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  className="w-full text-white/70 hover:text-white hover:bg-white/10" 
                  onClick={() => setShowForgotPassword(true)}
                >
                  Забыли пароль?
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Имя пользователя</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">Пароль</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white/5 border-white/20 text-white pr-10"
                      placeholder="Минимум 6 символов"
                      required
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
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={loading}
                >
                  {loading ? "Регистрируем..." : "Зарегистрироваться"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
