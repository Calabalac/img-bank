
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Clock, 
  Zap, 
  Camera, 
  Upload, 
  Shield, 
  Users, 
  BarChart3, 
  Sparkles, 
  Globe, 
  Lock, 
  TrendingUp,
  Palette,
  Search,
  Share2,
  Download,
  Edit,
  Eye,
  ArrowRight
} from 'lucide-react';

const Features = () => {
  const navigate = useNavigate();

  const completedFeatures = [
    {
      icon: Upload,
      title: "Быстрая загрузка файлов",
      description: "Перетаскивание файлов, множественная загрузка, поддержка всех форматов изображений",
      category: "Основные"
    },
    {
      icon: Shield,
      title: "Система аутентификации",
      description: "Безопасная регистрация и вход, управление профилями пользователей",
      category: "Безопасность"
    },
    {
      icon: Lock,
      title: "Контроль доступа",
      description: "Приватные, публичные и общие изображения с гранулярными правами",
      category: "Безопасность"
    },
    {
      icon: Users,
      title: "Админ панель",
      description: "Полноценное управление пользователями, контентом и системными настройками",
      category: "Управление"
    },
    {
      icon: BarChart3,
      title: "Аналитика в реальном времени",
      description: "Статистика просмотров, загрузок и активности пользователей",
      category: "Аналитика"
    },
    {
      icon: Globe,
      title: "Публичная галерея",
      description: "Открытая галерея для анонимного просмотра и загрузки изображений",
      category: "Социальные"
    },
    {
      icon: Palette,
      title: "Темная/светлая тема",
      description: "Адаптивный дизайн с поддержкой темной и светлой темы",
      category: "UI/UX"
    },
    {
      icon: Eye,
      title: "Просмотр изображений",
      description: "Полноэкранный просмотр с зумом и навигацией",
      category: "Основные"
    }
  ];

  const upcomingFeatures = [
    {
      icon: Sparkles,
      title: "ИИ-обработка изображений",
      description: "Автоматическое улучшение качества, удаление фона, генерация описаний",
      category: "ИИ",
      priority: "Высокий"
    },
    {
      icon: Search,
      title: "Умный поиск",
      description: "Поиск по содержимому изображений с помощью ИИ, распознавание объектов",
      category: "ИИ",
      priority: "Высокий"
    },
    {
      icon: Edit,
      title: "Встроенный редактор",
      description: "Базовое редактирование: обрезка, поворот, фильтры, коррекция",
      category: "Редактирование",
      priority: "Средний"
    },
    {
      icon: Share2,
      title: "Расширенный шеринг",
      description: "Социальные сети, прямые ссылки, встраивание, коллаборация",
      category: "Социальные",
      priority: "Средний"
    },
    {
      icon: Download,
      title: "Массовые операции",
      description: "Пакетная обработка, экспорт в различных форматах, архивы",
      category: "Продуктивность",
      priority: "Средний"
    },
    {
      icon: TrendingUp,
      title: "Продвинутая аналитика",
      description: "Тепловые карты, A/B тестирование, детальная сегментация",
      category: "Аналитика",
      priority: "Низкий"
    },
    {
      icon: Users,
      title: "Команды и организации",
      description: "Создание команд, роли, совместная работа над проектами",
      category: "Коллаборация",
      priority: "Низкий"
    },
    {
      icon: Zap,
      title: "API и интеграции",
      description: "RESTful API, вебхуки, интеграция с популярными сервисами",
      category: "Разработка",
      priority: "Низкий"
    }
  ];

  const painPoints = [
    {
      problem: "Медленная загрузка больших файлов",
      solution: "Оптимизированная загрузка с прогрессом и автосжатием"
    },
    {
      problem: "Потеря качества при сжатии",
      solution: "ИИ-алгоритмы сохранения качества при оптимизации"
    },
    {
      problem: "Сложное управление правами доступа",
      solution: "Интуитивная система ролей и разрешений"
    },
    {
      problem: "Отсутствие поиска по содержимому",
      solution: "Умный поиск с распознаванием объектов и текста"
    },
    {
      problem: "Неудобный просмотр на мобильных",
      solution: "Адаптивный дизайн с оптимизацией для всех устройств"
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Основные": "bg-blue-500",
      "Безопасность": "bg-red-500",
      "Управление": "bg-purple-500",
      "Аналитика": "bg-green-500",
      "Социальные": "bg-pink-500",
      "UI/UX": "bg-indigo-500",
      "ИИ": "bg-yellow-500",
      "Редактирование": "bg-orange-500",
      "Продуктивность": "bg-cyan-500",
      "Коллаборация": "bg-teal-500",
      "Разработка": "bg-gray-500"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      "Высокий": "destructive",
      "Средний": "secondary",
      "Низкий": "outline"
    };
    return colors[priority as keyof typeof colors] || "outline";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 backdrop-blur-lg bg-white/20 dark:bg-black/20 rounded-2xl p-8 shadow-2xl border border-white/20">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Функции ImageHub Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Полный обзор реализованных возможностей и планов развития платформы
          </p>
        </div>

        {/* Pain Points Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
            Проблемы, которые мы решаем
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {painPoints.map((item, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">❌ Проблема:</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.problem}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">✅ Решение:</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Completed Features */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Реализованные функции ({completedFeatures.length})
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedFeatures.map((feature, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800 dark:text-white">{feature.title}</CardTitle>
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge className={`${getCategoryColor(feature.category)} text-white w-fit`}>
                    {feature.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="h-8 w-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Планируемые функции ({upcomingFeatures.length})
            </h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-800 dark:text-white">{feature.title}</CardTitle>
                      </div>
                    </div>
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getCategoryColor(feature.category)} text-white`}>
                      {feature.category}
                    </Badge>
                    <Badge variant={getPriorityColor(feature.priority) as any}>
                      {feature.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-4">
            <Card className="backdrop-blur-lg bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 shadow-xl text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{completedFeatures.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Готовых функций</div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-xl text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{upcomingFeatures.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">В разработке</div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 shadow-xl text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {Math.round((completedFeatures.length / (completedFeatures.length + upcomingFeatures.length)) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Готовность</div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 shadow-xl text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {upcomingFeatures.filter(f => f.priority === "Высокий").length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Приоритетных</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="text-center backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              Готовы испытать будущее управления изображениями?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Начните использовать уже доступные функции и будьте первыми, кто получит доступ к новым возможностям
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/gallery')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl"
              >
                <Camera className="h-5 w-5 mr-2" />
                Начать использовать
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="backdrop-blur-lg bg-white/30 dark:bg-black/20 border border-white/30"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Создать аккаунт
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Features;
