
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Search, Image as ImageIcon } from 'lucide-react';
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

  const getImageUrl = (filename: string) => {
    return `https://jafuyqfmcpilcvzzmmwq.supabase.co/storage/v1/object/public/images/public/${filename}`;
  };

  const filteredImages = images.filter(image =>
    image.original_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Публичная галерея</h1>
          <p className="text-muted-foreground mb-6">
            Просматривайте и загружайте изображения без регистрации
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск изображений..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
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
              <Button disabled={uploading} className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Загрузка...' : 'Загрузить'}
              </Button>
            </div>
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Нет изображений</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'По вашему запросу ничего не найдено' : 'Станьте первым, кто загрузит изображение!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <img
                    src={getImageUrl(image.filename)}
                    alt={image.original_name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM2NjYiLz4KPHA+PC9wPgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate mb-2">{image.original_name}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{new Date(image.uploaded_at).toLocaleDateString('ru-RU')}</span>
                    <span>{image.view_count || 0} просмотров</span>
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
