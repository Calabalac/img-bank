
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';
import { Camera, Upload, Users, BarChart3, Shield, Zap, Globe, Lock, Sparkles, TrendingUp, Star } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="backdrop-blur-lg bg-white/30 dark:bg-black/20 rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <Header />
        
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/20 dark:to-purple-400/20"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="backdrop-blur-lg bg-white/10 dark:bg-black/10 rounded-3xl p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <Camera className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                  <Sparkles className="h-8 w-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                ImageHub Pro
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Революционная платформа для управления изображениями нового поколения. 
                Искусственный интеллект, автоматическая обработка и профессиональные инструменты.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button 
                  size="lg"
                  onClick={() => navigate('/gallery')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl text-lg px-8 py-4 rounded-2xl backdrop-blur-sm border border-white/20"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  Открыть галерею
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="backdrop-blur-lg bg-white/30 dark:bg-black/20 border border-white/30 text-gray-700 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/30 text-lg px-8 py-4 rounded-2xl shadow-xl"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Присоединиться
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Возможности будущего
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Передовые технологии для работы с изображениями
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 w-fit group-hover:from-blue-400 group-hover:to-blue-500 transition-all">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 dark:text-white">Мгновенная загрузка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Перетащите файлы прямо в браузер. Поддержка множественной загрузки и автоматическая оптимизация
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 w-fit group-hover:from-purple-400 group-hover:to-purple-500 transition-all">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 dark:text-white">Максимальная безопасность</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Шифрование уровня банка, контроль доступа и соответствие GDPR. Ваши данные в безопасности
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 w-fit group-hover:from-green-400 group-hover:to-green-500 transition-all">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 dark:text-white">ИИ-обработка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Автоматическое улучшение качества, удаление фона и генерация тегов с помощью ИИ
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 w-fit group-hover:from-orange-400 group-hover:to-orange-500 transition-all">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 dark:text-white">Аналитика в реальном времени</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Детальная статистика просмотров, популярности и взаимодействий с контентом
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 w-fit group-hover:from-pink-400 group-hover:to-pink-500 transition-all">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 dark:text-white">Глобальный CDN</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Молниеносная загрузка изображений по всему миру благодаря сети доставки контента
                  </p>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 w-fit group-hover:from-indigo-400 group-hover:to-indigo-500 transition-all">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-gray-800 dark:text-white">Командная работа</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    Совместное редактирование, комментарии и управление правами доступа в команде
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <div className="backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                Готовы начать?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам пользователей, которые уже используют ImageHub Pro
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/features')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl text-lg px-8 py-4 rounded-2xl backdrop-blur-sm border border-white/20"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Узнать больше о функциях
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 backdrop-blur-lg bg-white/20 dark:bg-black/20 rounded-2xl p-6 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            Добро пожаловать, {user.email?.split('@')[0]}! 
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Управляйте своими изображениями профессионально</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 hover:scale-105 group"
                onClick={() => navigate('/library')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:from-blue-400 group-hover:to-blue-500 transition-all">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                Библиотека
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">Управляйте своей коллекцией изображений с ИИ-инструментами</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 hover:scale-105 group"
                onClick={() => navigate('/gallery')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 group-hover:from-purple-400 group-hover:to-purple-500 transition-all">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                Публичная галерея
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">Откройте для себя популярные изображения сообщества</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 hover:scale-105 group"
                onClick={() => navigate('/admin')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600 group-hover:from-green-400 group-hover:to-green-500 transition-all">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Админ панель
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">Продвинутая аналитика и управление системой</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 hover:scale-105 group"
                onClick={() => navigate('/features')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 group-hover:from-orange-400 group-hover:to-orange-500 transition-all">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                Функции
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">Полный обзор возможностей и планов развития</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-300 cursor-pointer backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 hover:scale-105 group md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-white">
                <div className="p-2 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 group-hover:from-pink-400 group-hover:to-pink-500 transition-all">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                Статистика активности
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">Отслеживайте производительность и рост вашей коллекции</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
