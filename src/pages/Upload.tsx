
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, Link } from 'lucide-react';
import FileUploader from '@/components/upload/FileUploader';
import UrlUploader from '@/components/upload/UrlUploader';

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Центр загрузок</h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
              Загружайте файлы с компьютера или импортируйте по прямой ссылке.
            </p>
          </div>

          <Tabs defaultValue="file" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
              <TabsTrigger value="file" className="py-2.5 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all flex items-center justify-center gap-2">
                <UploadCloud className="w-5 h-5" />
                С компьютера
              </TabsTrigger>
              <TabsTrigger value="url" className="py-2.5 text-sm font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:shadow-sm rounded-md transition-all flex items-center justify-center gap-2">
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
        </div>
      </main>
    </div>
  );
};

export default UploadPage;
