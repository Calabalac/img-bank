
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getImageByShortUrl, getPublicUrl, ImageData } from "@/utils/imageUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ImageView = () => {
  const { filename } = useParams<{ filename: string }>();
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      if (!filename) {
        setError("Имя файла не указано");
        setLoading(false);
        return;
      }

      try {
        const shortUrl = `https://img-bank.lovable.app/${filename}`;
        const imageData = await getImageByShortUrl(shortUrl);
        
        if (!imageData) {
          setError("Изображение не найдено");
        } else {
          setImage(imageData);
        }
      } catch (err) {
        console.error('Ошибка загрузки изображения:', err);
        setError("Ошибка загрузки изображения");
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [filename]);

  const handleDownload = () => {
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = getPublicUrl(image.filename);
    link.download = image.original_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Загрузка изображения...</span>
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <Card>
            <CardContent className="p-8">
              <div className="text-6xl mb-4">😞</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {error || "Изображение не найдено"}
              </h1>
              <p className="text-gray-600 mb-6">
                Возможно, изображение было удалено или ссылка указана неверно.
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Вернуться на главную
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в банк изображений
            </Button>
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {image.original_name}
              </h1>
              <p className="text-gray-600">
                Загружено: {new Date(image.uploaded_at).toLocaleString()}
              </p>
            </div>

            <div className="mb-6">
              <img
                src={getPublicUrl(image.filename)}
                alt={image.original_name}
                className="w-full max-h-[70vh] object-contain rounded-lg shadow-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-sm text-gray-600">
                <p>Размер: {image.file_size ? (image.file_size / 1024 / 1024).toFixed(2) + ' MB' : 'Неизвестно'}</p>
                <p>Тип: {image.mime_type || 'Неизвестно'}</p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Скачать
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Короткая ссылка:</p>
              <code className="text-sm bg-white px-3 py-2 rounded border block break-all">
                {image.short_url}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageView;
