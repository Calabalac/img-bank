import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Mail, Link, BarChart3 } from 'lucide-react';

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
      name: "Управление изображениями",
      description: "Загрузка и просмотр изображений",
      progress: 85,
      status: "in-progress"
    },
    {
      name: "Библиотека файлов",
      description: "Организация и поиск по файлам",
      progress: 70,
      status: "in-progress"
    },
    {
      name: "Шифрование данных",
      description: "Безопасное хранение пользовательских данных",
      progress: 45,
      status: "planned"
    },
    {
      name: "API интеграция",
      description: "Подключение внешних сервисов",
      progress: 30,
      status: "planned"
    },
    {
      name: "Мобильное приложение",
      description: "Адаптация под мобильные устройства",
      progress: 15,
      status: "planned"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-yellow-400';
      case 'planned': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  const overallProgress = Math.round(features.reduce((sum, feature) => sum + feature.progress, 0) / features.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <h1 className="text-3xl font-bold text-white">О проекте Image Hub</h1>
        </div>

        {/* Общая информация */}
        <Card className="mb-8 backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Прогресс разработки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-white">
                <span>Общий прогресс проекта</span>
                <span className="font-bold">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Описание проекта */}
        <Card className="mb-8 backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Описание</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-4">
            <p>
              <strong className="text-white">Image Hub</strong> — это современная платформа для управления 
              и организации изображений с продвинутыми возможностями аутентификации и безопасности.
            </p>
            <p>
              Проект построен на современном техническом стеке: React, TypeScript, Tailwind CSS, 
              Supabase для backend и Shadcn/UI для компонентов интерфейса.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Ключевые технологии:</h4>
                <ul className="text-sm space-y-1">
                  <li>• React 18 + TypeScript</li>
                  <li>• Tailwind CSS + Shadcn/UI</li>
                  <li>• Supabase (Database + Auth)</li>
                  <li>• React Router + Tanstack Query</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Основные функции:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Безопасная аутентификация</li>
                  <li>• Управление изображениями</li>
                  <li>• Организация файлов</li>
                  <li>• Responsive дизайн</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Функции и прогресс */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Функции и их статус</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{feature.name}</h4>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getStatusColor(feature.status)}`}>
                        {feature.progress}%
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={feature.progress} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate('/auth')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Начать использование
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
