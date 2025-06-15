
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-md backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Image Hub</CardTitle>
            <p className="text-slate-300">Платформа для управления изображениями</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Войти в аккаунт
            </Button>
            <Button 
              onClick={() => navigate('/about')} 
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              О проекте
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Добро пожаловать!</h1>
            <p className="text-slate-300">Email: {user.email}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/about')} 
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              О проекте
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => navigate('/library')}>
            <CardHeader>
              <CardTitle className="text-white">Библиотека</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Управление изображениями</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Статистика</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Скоро будет доступно</p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Настройки</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Скоро будет доступно</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
