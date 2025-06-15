
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Link, Zap, Shield, Globe } from 'lucide-react';
import FileUploader from '@/components/upload/FileUploader';
import UrlUploader from '@/components/upload/UrlUploader';

const UploadPage = () => {
  const features = [
    {
      icon: Zap,
      title: "Молниеносная загрузка",
      description: "Оптимизированные алгоритмы для быстрой обработки файлов"
    },
    {
      icon: Shield,
      title: "Безопасное хранение",
      description: "Ваши файлы защищены современным шифрованием"
    },
    {
      icon: Globe,
      title: "Мгновенный доступ",
      description: "Получите короткую ссылку сразу после загрузки"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Центр загрузок
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Загружайте изображения с компьютера или импортируйте по прямой ссылке. 
              Быстро, безопасно, профессионально.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-slate-900 dark:text-slate-100">
                Выберите способ загрузки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="file" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mb-6">
                  <TabsTrigger 
                    value="file" 
                    className="py-3 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-5 h-5" />
                    С компьютера
                  </TabsTrigger>
                  <TabsTrigger 
                    value="url" 
                    className="py-3 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm rounded-md transition-all flex items-center justify-center gap-2"
                  >
                    <Link className="w-5 h-5" />
                    По ссылке
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="mt-6">
                  <FileUploader />
                </TabsContent>
                
                <TabsContent value="url" className="mt-6">
                  <UrlUploader />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Поддерживаемые форматы: JPG, PNG, GIF, WebP, SVG • Максимальный размер: 50MB
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
