
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link, Images, Copy, Trash2, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  ImageData,
  uploadImageToStorage, 
  saveImageMetadata, 
  getAllImages, 
  deleteImage, 
  getPublicUrl,
  generateShortUrl 
} from "@/utils/imageUtils";

const Index = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlsTextarea, setUrlsTextarea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleUrlAdd = async () => {
    if (!urlInput.trim()) return;

    setIsLoading(true);
    try {
      // Проверяем, что это действительно изображение
      const response = await fetch(urlInput, { method: 'HEAD' });
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('URL не указывает на изображение');
      }

      // Загружаем изображение
      const imageResponse = await fetch(urlInput);
      const blob = await imageResponse.blob();
      
      // Создаем файл из blob
      const filename = urlInput.split('/').pop() || 'image';
      const file = new File([blob], filename, { type: contentType });

      // Загружаем в хранилище
      const storedFilename = await uploadImageToStorage(file);
      const imageData = await saveImageMetadata(file, storedFilename);

      setImages(prev => [imageData, ...prev]);
      setUrlInput("");

      toast({
        title: "Изображение добавлено",
        description: "Изображение по ссылке добавлено в банк",
      });
    } catch (error) {
      console.error('Ошибка добавления по URL:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить изображение по ссылке",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <Images className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Img Bank
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Современный сервис для хранения изображений с короткими ссылками. 
              Загружайте, организуйте и делитесь своими изображениями легко и быстро.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Быстрая загрузка
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Короткие ссылки
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Массовая обработка
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        {/* Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Files */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
                  <Upload className="h-5 w-5" />
                </div>
                Загрузить файлы
              </CardTitle>
              <CardDescription className="text-gray-600">
                Выберите изображения с вашего устройства
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
                  Выберите изображения
                </Label>
                <div className="relative">
                  <Input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-200 bg-gray-50/50 h-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add by URL */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white">
                  <Link className="h-5 w-5" />
                </div>
                Добавить по ссылке
              </CardTitle>
              <CardDescription className="text-gray-600">
                Вставьте ссылку на изображение
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="url-input" className="text-sm font-medium text-gray-700">
                  URL изображения
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 border-gray-300 focus:border-blue-500 transition-colors duration-200"
                  />
                  <Button 
                    onClick={handleUrlAdd}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-6 transition-all duration-200"
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk URLs */}
        <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-gray-800">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg text-white">
                <Plus className="h-5 w-5" />
              </div>
              Массовое добавление ссылок
            </CardTitle>
            <CardDescription className="text-gray-600">
              Вставьте несколько ссылок, каждая с новой строки
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                value={urlsTextarea}
                onChange={(e) => setUrlsTextarea(e.target.value)}
                disabled={isLoading}
                rows={4}
                className="border-gray-300 focus:border-blue-500 transition-colors duration-200 bg-gray-50/50"
              />
              <Button 
                onClick={handleBulkUrls} 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-12 text-base font-medium transition-all duration-200"
              >
                {isLoading ? "Обработка..." : "Добавить все ссылки"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Images Gallery */}
        {images.length > 0 && (
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                  <Images className="h-5 w-5" />
                </div>
                Банк изображений
                <div className="ml-auto px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-sm font-medium">
                  {images.length}
                </div>
              </CardTitle>
              <CardDescription className="text-gray-600">
                Ваши загруженные изображения с короткими ссылками
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div key={image.id} className="group relative bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="aspect-video mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden relative">
                      <img
                        src={getPublicUrl(image.filename)}
                        alt={image.original_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PC9wPgo8L3N2Zz4K';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="font-medium text-sm text-gray-800 truncate">{image.original_name}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-lg flex-1 truncate font-mono text-gray-700">
                          {generateShortUrl(image.filename)}
                        </code>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateShortUrl(image.filename))}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteImage(image)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {new Date(image.uploaded_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {images.length === 0 && (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Images className="h-12 w-12 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Пока что банк пустой
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Загрузите изображения или добавьте ссылки, чтобы начать создавать свою коллекцию
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span>Загрузка изображений...</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-white/30 backdrop-blur-sm border-t border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">© 2024 Img Bank. Создано для удобного хранения и обмена изображениями.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
