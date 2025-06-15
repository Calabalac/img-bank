
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Search, Image as ImageIcon, Eye, Download, Star, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageData {
  id: string;
  filename: string;
  original_name: string;
  uploaded_at: string;
  view_count: number;
  download_count: number;
}

const Gallery = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublicImages();
  }, []);

  const fetchPublicImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('id, filename, original_name, uploaded_at, view_count, download_count')
        .eq('access_type', 'public')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображения",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const filename = `${Date.now()}-${file.name}`;
      const filePath = `public/${filename}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from('images')
        .insert({
          filename,
          original_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          access_type: 'public',
          short_url: `/${filename}`,
        });

      if (dbError) throw dbError;

      toast({
        title: "Успешно!",
        description: "Изображение загружено в публичную галерею",
      });

      fetchPublicImages();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const getImageUrl = (filename: string) => {
    return `https://jafuyqfmcpilcvzzmmwq.supabase.co/storage/v1/object/public/images/public/${filename}`;
  };

  const filteredImages = images.filter(image =>
    image.original_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="backdrop-blur-lg bg-white/30 dark:bg-black/20 rounded-2xl p-8 shadow-2xl border border-white/20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 backdrop-blur-lg bg-white/20 dark:bg-black/20 rounded-2xl p-6 shadow-2xl border border-white/20">
          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Публичная галерея
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Откройте для себя удивительные изображения от сообщества. Загружайте без регистрации!
          </p>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Поиск изображений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 backdrop-blur-lg bg-white/30 dark:bg-black/20 border border-white/20 focus:bg-white/40 dark:focus:bg-black/30"
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button 
                  disabled={uploading} 
                  className="backdrop-blur-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border border-white/20 shadow-xl"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? 'Загрузка...' : 'Загрузить'}
                </Button>
              </div>
            </div>
          </div>

          {/* Drop Zone */}
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              dragOver 
                ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            } backdrop-blur-sm bg-white/10 dark:bg-black/10`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  Перетащите изображения сюда
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  или нажмите на кнопку "Загрузить" выше
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <span className="text-lg font-bold text-gray-800 dark:text-white">{images.length}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Всего изображений</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {images.reduce((acc, img) => acc + (img.view_count || 0), 0)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Просмотров</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 shadow-xl">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Download className="h-5 w-5 text-purple-500" />
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  {images.reduce((acc, img) => acc + (img.download_count || 0), 0)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Скачиваний</p>
            </CardContent>
          </Card>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-20 backdrop-blur-lg bg-white/20 dark:bg-black/20 rounded-2xl shadow-xl border border-white/20">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 w-fit mx-auto mb-6">
              <ImageIcon className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
              {searchTerm ? 'Ничего не найдено' : 'Галерея пуста'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Станьте первым, кто поделится своим творчеством!'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl"
              >
                <Upload className="h-4 w-4 mr-2" />
                Загрузить первое изображение
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 backdrop-blur-lg bg-white/20 dark:bg-black/20 border border-white/20 hover:scale-105 group">
                <div className="aspect-square bg-white/10 dark:bg-black/10 relative overflow-hidden">
                  <img
                    src={getImageUrl(image.filename)}
                    alt={image.original_name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM2NjYiLz4KPHA+PC9wPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-4 text-white text-sm">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{image.view_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          <span>{image.download_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate mb-2 text-gray-800 dark:text-white">{image.original_name}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span>{new Date(image.uploaded_at).toLocaleDateString('ru-RU')}</span>
                    <div className="flex items-center gap-1">
                      {(image.view_count || 0) > 100 && <Star className="h-3 w-3 text-yellow-500" />}
                      {(image.view_count || 0) > 1000 && <TrendingUp className="h-3 w-3 text-orange-500" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
