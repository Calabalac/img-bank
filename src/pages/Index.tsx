
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link, Images, Copy, Trash2, Plus, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StoredImage {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  uploadedAt: Date;
}

const Index = () => {
  const [images, setImages] = useState<StoredImage[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [urlsTextarea, setUrlsTextarea] = useState("");
  const { toast } = useToast();

  const generateShortUrl = (id: string) => {
    return `https://imgbank.app/${id}`;
  };

  const generateId = () => {
    return Math.random().toString(36).substr(2, 8);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const id = generateId();
        const newImage: StoredImage = {
          id,
          name: file.name,
          url: e.target?.result as string,
          shortUrl: generateShortUrl(id),
          uploadedAt: new Date(),
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: "Изображения загружены",
      description: `Загружено ${files.length} изображений`,
    });
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return;

    const id = generateId();
    const newImage: StoredImage = {
      id,
      name: `Image ${id}`,
      url: urlInput,
      shortUrl: generateShortUrl(id),
      uploadedAt: new Date(),
    };

    setImages(prev => [...prev, newImage]);
    setUrlInput("");

    toast({
      title: "Изображение добавлено",
      description: "Изображение по ссылке добавлено в банк",
    });
  };

  const handleBulkUrls = () => {
    const urls = urlsTextarea
      .split('\n')
      .map(url => url.trim())
      .filter(url => url && url.startsWith('http'));

    urls.forEach(url => {
      const id = generateId();
      const newImage: StoredImage = {
        id,
        name: `Image ${id}`,
        url,
        shortUrl: generateShortUrl(id),
        uploadedAt: new Date(),
      };
      setImages(prev => [...prev, newImage]);
    });

    setUrlsTextarea("");

    toast({
      title: "Изображения добавлены",
      description: `Добавлено ${urls.length} изображений`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  const deleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Изображение удалено",
      description: "Изображение удалено из банка",
    });
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
                    className="flex-1 border-gray-300 focus:border-blue-500 transition-colors duration-200"
                  />
                  <Button 
                    onClick={handleUrlAdd}
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
                rows={4}
                className="border-gray-300 focus:border-blue-500 transition-colors duration-200 bg-gray-50/50"
              />
              <Button 
                onClick={handleBulkUrls} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-12 text-base font-medium transition-all duration-200"
              >
                Добавить все ссылки
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
                        src={image.url}
                        alt={image.name}
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
                      <p className="font-medium text-sm text-gray-800 truncate">{image.name}</p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-2 rounded-lg flex-1 truncate font-mono text-gray-700">
                          {image.shortUrl}
                        </code>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(image.shortUrl)}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteImage(image.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {image.uploadedAt.toLocaleString()}
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
