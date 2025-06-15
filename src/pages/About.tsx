
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { BarChart3, Camera, Shield, Users, Zap } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      name: "Авторизация с паролем",
      description: "Вход в систему с использованием email и пароля",
      progress: 100,
      status: "completed"
    },
    {
      name: "Magic Link авторизация",
      description: "Вход через одноразовую ссылку на email",
      progress: 100,
      status: "completed"
    },
    {
      name: "Восстановление пароля",
      description: "Сброс пароля через email",
      progress: 100,
      status: "completed"
    },
    {
      name: "Публичная галерея",
      description: "Просмотр и загрузка без регистрации",
      progress: 100,
      status: "completed"
    },
    {
      name: "Темная/светлая тема",
      description: "Переключение между темами интерфейса",
      progress: 100,
      status: "completed"
    },
    {
      name: "Управление изображениями",
      description: "Загрузка и просмотр изображений",
      progress: 95,
      status: "completed"
    },
    {
      name: "Админская панель",
      description: "Управление пользователями и контентом",
      progress: 90,
      status: "completed"
    },
    {
      name: "Библиотека файлов",
      description: "Организация и поиск по файлам",
      progress: 85,
      status: "in-progress"
    },
    {
      name: "Аналитика",
      description: "Система сбора и анализа данных",
      progress: 70,
      status: "in-progress"
    },
    {
      name: "API интеграция",
      description: "Подключение внешних сервисов",
      progress: 30,
      status: "planned"
    }
  ];

  const overallProgress = Math.round(features.reduce((sum, feature) => sum + feature.progress, 0) / features.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Camera className="h-8 w-8 text-primary" />
            О проекте ImageHub
          </h1>
        </div>

        {/* Общий прогресс */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Прогресс разработки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Общий прогресс проекта</span>
                <span className="font-bold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Описание проекта */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Описание</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>ImageHub</strong> — это современная платформа для управления 
              и организации изображений с продвинутыми возможностями аутентификации и безопасности.
            </p>
            <p>
              Проект построен на современном техническом стеке и предназначен для использования 
              как профессиональный micro SaaS сервис.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Ключевые технологии:
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS + Shadcn/UI</li>
                  <li>• Supabase (Database + Auth + Storage)</li>
                  <li>• React Router + Tanstack Query</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Основные функции:
                </h4>
                <ul className="text-sm space-y-1">
                  <li>• Безопасная аутентификация</li>
                  <li>• Публичная галерея</li>
                  <li>• Админская панель</li>
                  <li>• Темная/светлая тема</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Функции и прогресс */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Функции и их статус</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        feature.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                        feature.status === 'in-progress' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`}>
                        {feature.progress}%
                      </div>
                    </div>
                  </div>
                  <Progress value={feature.progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={() => navigate('/gallery')} size="lg">
            Посетить галерею
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
