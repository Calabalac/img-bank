import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link, Images, Plus, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  ImageData,
  uploadImageToStorage, 
  saveImageMetadata, 
  getAllImages
} from "@/utils/imageUtils";

const Index = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [urlsTextarea, setUrlsTextarea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Загружаем изображения при запуске
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const loadedImages = await getAllImages();
      setImages(loadedImages);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображения",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsLoading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        // Загружаем файл в хранилище
        const filename = await uploadImageToStorage(file);
        
        // Сохраняем метаданные в базу данных
        const imageData = await saveImageMetadata(file, filename);
        
        return imageData;
      } catch (error) {
        console.error('Ошибка загрузки файла:', file.name, error);
        toast({
          title: "Ошибка загрузки",
          description: `Не удалось загрузить файл ${file.name}`,
          variant: "destructive",
        });
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null) as ImageData[];
      
      if (successfulUploads.length > 0) {
        setImages(prev => [...successfulUploads, ...prev]);
        toast({
          title: "Изображения загружены",
          description: `Загружено ${successfulUploads.length} из ${files.length} изображений`,
        });
      }
    } catch (error) {
      console.error('Ошибка массовой загрузки:', error);
    } finally {
      setIsLoading(false);
      // Очищаем input
      event.target.value = '';
    }
  };

  const handleBulkUrls = async () => {
    const urls = urlsTextarea
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && url.startsWith('http'));

    if (urls.length === 0) return;

    setIsLoading(true);
    let successCount = 0;

    for (const url of urls) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('content-type');
        
        if (!contentType || !contentType.startsWith('image/')) {
          continue;
        }

        const imageResponse = await fetch(url);
        const blob = await imageResponse.blob();
        
        const filename = url.split('/').pop() || 'image';
        const file = new File([blob], filename, { type: contentType });

        const storedFilename = await uploadImageToStorage(file);
        const imageData = await saveImageMetadata(file, storedFilename);

        setImages(prev => [imageData, ...prev]);
        successCount++;
      } catch (error) {
        console.error('Ошибка добавления URL:', url, error);
      }
    }

    setUrlsTextarea("");
    setIsLoading(false);

    toast({
      title: "Изображения добавлены",
      description: `Добавлено ${successCount} из ${urls.length} изображений`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  const handleDeleteImage = async (imageData: ImageData) => {
    try {
      await deleteImage(imageData.id, imageData.filename);
      setImages(prev => prev.filter(img => img.id !== imageData.id));
      toast({
        title: "Изображение удалено",
        description: "Изображение удалено из банка",
      });
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить изображение",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 top-1/2 -right-40 animate-pulse delay-1000"></div>
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 bottom-0 left-1/3 animate-pulse delay-500"></div>
      </div>

      {/* Hero Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="relative p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
                <Images className="h-16 w-16 text-white relative z-10" />
              </div>
            </div>
            <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              ImageBank
            </h1>
            <div className="max-w-3xl mx-auto space-y-4">
              <p className="text-2xl text-slate-300 font-light leading-relaxed">
                Корпоративное решение для управления изображениями
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                Безопасное хранение, мгновенная доставка и профессиональные инструменты 
                для работы с визуальным контентом вашей компании
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Button 
                onClick={() => navigate('/library')}
                className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-8 text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0"
              >
                <FolderOpen className="h-5 w-5 mr-3" />
                Открыть библиотеку
              </Button>
            </div>

            {/* Status indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-slate-300">
              <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Global CDN</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>API Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Upload Files */}
          <Card className="group backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="relative p-3 backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-2xl">
                  <Upload className="h-6 w-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-lg"></div>
                </div>
                Загрузка файлов
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Загрузите изображения с локального устройства
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Label htmlFor="file-upload" className="text-sm font-medium text-slate-200">
                  Выберите файлы
                </Label>
                <div className="relative group">
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="cursor-pointer border-2 border-dashed border-white/20 hover:border-white/40 transition-colors duration-300 bg-white/5 backdrop-blur-md h-16 text-white file:text-white file:bg-blue-600 file:hover:bg-blue-700 file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Plus className="h-6 w-6 text-slate-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk URLs */}
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl hover:bg-white/10 transition-all duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-white text-xl">
                <div className="relative p-3 backdrop-blur-md bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-white/20 rounded-2xl">
                  <Link className="h-6 w-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-lg"></div>
                </div>
                Массовое добавление
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Добавьте изображения по ссылкам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Textarea
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  value={urlsTextarea}
                  onChange={(e) => setUrlsTextarea(e.target.value)}
                  disabled={isLoading}
                  rows={5}
                  className="border border-white/20 bg-white/5 backdrop-blur-md text-white placeholder:text-slate-400 focus:border-white/40 transition-colors duration-300 resize-none"
                />
                <Button 
                  onClick={handleBulkUrls} 
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Обработка...
                    </div>
                  ) : (
                    "Добавить изображения"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        {images.length > 0 && (
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-white text-2xl">
                <div className="relative p-3 backdrop-blur-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-2xl">
                  <Images className="h-6 w-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-lg"></div>
                </div>
                Статистика библиотеки
                <div className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg">
                  {images.length} файлов
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-slate-300 text-lg mb-6">
                  В вашей библиотеке {images.length} изображений
                </p>
                <Button 
                  onClick={() => navigate('/library')}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0"
                >
                  <FolderOpen className="h-5 w-5 mr-2" />
                  Перейти в библиотеку
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {images.length === 0 && (
          <div className="text-center py-20 backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl mb-12">
            <div className="max-w-md mx-auto">
              <div className="relative p-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                <Images className="h-16 w-16 text-slate-400" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Библиотека пуста
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">
                Загрузите первые изображения, чтобы начать работу с корпоративной библиотекой
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center z-50">
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 flex items-center gap-4 shadow-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="text-white text-lg">Обработка изображений...</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 backdrop-blur-md bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Images className="h-6 w-6 text-slate-400" />
              <span className="text-slate-300 font-semibold">ImageBank Enterprise</span>
            </div>
            <p className="text-sm text-slate-400">
              Профессиональное решение для управления корпоративными изображениями
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
