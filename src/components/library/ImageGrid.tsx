
import { useState } from 'react';
import { ImageData } from '@/utils/imageUtils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Eye, Trash2, Share2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDragDrop } from './DragDropProvider';

interface ImageGridProps {
  images: ImageData[];
  selectedImages: Set<string>;
  onSelectionChange: (imageId: string, selected: boolean) => void;
  onDelete: (imageId: string) => void;
}

export const ImageGrid = ({ 
  images, 
  selectedImages, 
  onSelectionChange, 
  onDelete 
}: ImageGridProps) => {
  const { toast } = useToast();
  const { setDraggedItems, setIsDragging } = useDragDrop();
  const [draggedImage, setDraggedImage] = useState<string | null>(null);

  const handleDownload = async (image: ImageData) => {
    try {
      const response = await fetch(`https://jafuyqfmcpilcvzzmmwq.supabase.co/storage/v1/object/public/images/${image.file_path}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = image.original_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Загрузка начата',
        description: `Скачивание ${image.original_name}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось скачать файл',
        variant: 'destructive',
      });
    }
  };

  const handleView = (image: ImageData) => {
    window.open(`/${image.short_url}`, '_blank');
  };

  const handleShare = async (image: ImageData) => {
    const url = `${window.location.origin}/${image.short_url}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка на изображение скопирована в буфер обмена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать ссылку',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    const draggedItems = selectedImages.has(imageId) ? Array.from(selectedImages) : [imageId];
    setDraggedItems(draggedItems);
    setDraggedImage(imageId);
    setIsDragging(true);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify(draggedItems));
  };

  const handleDragEnd = () => {
    setDraggedItems([]);
    setDraggedImage(null);
    setIsDragging(false);
  };

  if (images.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <Eye className="w-12 h-12 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          Изображения не найдены
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          В этой папке пока нет изображений. Загрузите новые или перетащите существующие.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {images.map((image) => (
        <Card 
          key={image.id}
          className={`group overflow-hidden transition-all duration-200 hover:shadow-md border ${
            selectedImages.has(image.id) 
              ? 'ring-2 ring-blue-500 border-blue-500' 
              : 'border-slate-200 dark:border-slate-800'
          } ${draggedImage === image.id ? 'opacity-50' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, image.id)}
          onDragEnd={handleDragEnd}
        >
          <div className="relative">
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedImages.has(image.id)}
                onCheckedChange={(checked) => onSelectionChange(image.id, checked as boolean)}
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={`https://jafuyqfmcpilcvzzmmwq.supabase.co/storage/v1/object/public/images/${image.file_path}`}
                alt={image.original_name}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleView(image)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(image)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleShare(image)}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate mb-2">
              {image.original_name}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>{formatFileSize(image.file_size || 0)}</span>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(image.uploaded_at).toLocaleDateString('ru-RU')}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  image.access_type === 'public' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : image.access_type === 'shared'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300'
                }`}
              >
                {image.access_type === 'public' ? 'Публичное' : 
                 image.access_type === 'shared' ? 'Общий доступ' : 'Приватное'}
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(image.id)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
