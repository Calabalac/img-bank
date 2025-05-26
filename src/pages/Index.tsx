
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link, Images, Copy, Trash2 } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Images className="h-10 w-10 text-blue-600" />
            Img Bank
          </h1>
          <p className="text-xl text-gray-600">
            Сервис для хранения изображений с короткими ссылками
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Загрузить файлы
              </CardTitle>
              <CardDescription>
                Выберите изображения с вашего устройства
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="file-upload">Выберите изображения</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add by URL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Добавить по ссылке
              </CardTitle>
              <CardDescription>
                Вставьте ссылку на изображение
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="url-input">URL изображения</Label>
                <div className="flex gap-2">
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <Button onClick={handleUrlAdd}>Добавить</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk URLs */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Массовое добавление ссылок</CardTitle>
            <CardDescription>
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
              />
              <Button onClick={handleBulkUrls} className="w-full">
                Добавить все ссылки
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Images Gallery */}
        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Банк изображений ({images.length})</CardTitle>
              <CardDescription>
                Ваши загруженные изображения с короткими ссылками
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="aspect-video mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+PC9wPgo8L3N2Zz4K';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-sm truncate">{image.name}</p>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1 truncate">
                          {image.shortUrl}
                        </code>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(image.shortUrl)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteImage(image.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
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
          <div className="text-center py-12">
            <Images className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Пока что банк пустой
            </h3>
            <p className="text-gray-600">
              Загрузите изображения или добавьте ссылки, чтобы начать
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
