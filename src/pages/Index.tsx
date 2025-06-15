
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Upload, 
  Image, 
  Shield, 
  Zap, 
  Globe, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Upload,
      title: "Быстрая загрузка",
      description: "Загружайте изображения с компьютера или по ссылке за секунды"
    },
    {
      icon: Shield,
      title: "Безопасное хранение",
      description: "Ваши файлы защищены современными методами шифрования"
    },
    {
      icon: Globe,
      title: "Публичный доступ",
      description: "Делитесь изображениями с помощью коротких ссылок"
    },
    {
      icon: Users,
      title: "Организация в папки",
      description: "Структурируйте свои изображения с помощью папок"
    }
  ];

  const stats = [
    { label: "Загружено изображений", value: "10K+" },
    { label: "Активных пользователей", value: "500+" },
    { label: "Время отклика", value: "<100ms" },
    { label: "Uptime", value: "99.9%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-600/5 dark:to-purple-600/5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              <Zap className="w-3 h-3 mr-1" />
              Профессиональный хостинг изображений
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
              Загружайте и делитесь{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                изображениями
              </span>{" "}
              профессионально
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Современная платформа для хранения, организации и совместного использования изображений. 
              Быстро, безопасно, надежно.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Upload className="w-5 h-5 mr-2" />
                  Начать загрузку
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link to="/gallery">
                <Button variant="outline" size="lg" className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                  <Image className="w-5 h-5 mr-2" />
                  Просмотреть галерею
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Почему выбирают нас
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Мы предоставляем все необходимые инструменты для профессиональной работы с изображениями
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-slate-200 dark:border-slate-800">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Готовы начать?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам пользователей, которые уже доверяют нам свои изображения
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Бесплатная регистрация
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Без ограничений по размеру
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Техподдержка 24/7
                </div>
              </div>
              
              <Link to="/auth">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Создать аккаунт
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
