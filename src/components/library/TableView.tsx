
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { ImageData, getPublicUrl, generateShortUrl, updateImageAccess } from "@/utils/imageUtils";
import { SortField, SortDirection } from "@/pages/Library";
import { AccessControl } from "./AccessControl";
import { useToast } from "@/hooks/use-toast";
import { useDragDrop } from "./DragDropProvider";

interface TableViewProps {
  images: ImageData[];
  selectedImages: Set<string>;
  onImageSelect: (imageId: string, selected: boolean) => void;
  onCopyUrl: (url: string) => void;
  onDeleteImage: (image: ImageData) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const TableView = ({
  images,
  selectedImages,
  onImageSelect,
  onCopyUrl,
  onDeleteImage,
  sortField,
  sortDirection,
  onSort
}: TableViewProps) => {
  const { toast } = useToast();
  const { setDraggedItems, setIsDragging } = useDragDrop();

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Н/Д';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleAccessChange = async (imageId: string, accessType: 'public' | 'private' | 'shared') => {
    try {
      await updateImageAccess(imageId, accessType);
      toast({
        title: "Доступ обновлен",
        description: `Изображение теперь ${accessType === 'public' ? 'публичное' : accessType === 'shared' ? 'для друзей' : 'приватное'}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить доступ",
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    const itemsToMove = selectedImages.has(imageId) 
      ? Array.from(selectedImages) 
      : [imageId];
    
    setDraggedItems(itemsToMove);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItems([]);
    setIsDragging(false);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-slate-400 text-lg">Изображения не найдены</div>
      </div>
    );
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 text-slate-300 hover:text-white font-medium"
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </Button>
  );

  return (
    <Card className="backdrop-blur-md bg-white/5 border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="w-8">
                <Checkbox
                  checked={images.length > 0 && images.every(img => selectedImages.has(img.id))}
                  onCheckedChange={(checked) => {
                    images.forEach(img => onImageSelect(img.id, !!checked));
                  }}
                  className="border-white/30"
                />
              </TableHead>
              <TableHead className="w-12">Превью</TableHead>
              <TableHead className="min-w-0 max-w-32">
                <SortButton field="original_name">Название</SortButton>
              </TableHead>
              <TableHead className="w-16">
                <SortButton field="file_size">Размер</SortButton>
              </TableHead>
              <TableHead className="w-16">
                <SortButton field="mime_type">Тип</SortButton>
              </TableHead>
              <TableHead className="w-20">
                <SortButton field="uploaded_at">Дата</SortButton>
              </TableHead>
              <TableHead className="min-w-0 max-w-28">Ссылка</TableHead>
              <TableHead className="w-20">Доступ</TableHead>
              <TableHead className="w-24">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => (
              <TableRow 
                key={image.id} 
                className="border-white/10 hover:bg-white/5 transition-colors cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragEnd={handleDragEnd}
              >
                <TableCell className="w-8">
                  <Checkbox
                    checked={selectedImages.has(image.id)}
                    onCheckedChange={(checked) => onImageSelect(image.id, !!checked)}
                    className="border-white/30"
                  />
                </TableCell>
                
                <TableCell className="w-12">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={getPublicUrl(image.filename)}
                      alt={image.original_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM2NjYiLz4KPHA+PC9wPgo8L3N2Zz4K';
                      }}
                    />
                  </div>
                </TableCell>
                
                <TableCell className="min-w-0 max-w-32">
                  <div className="font-medium text-white truncate" title={image.original_name}>
                    {image.original_name}
                  </div>
                </TableCell>
                
                <TableCell className="w-16">
                  <span className="text-slate-300 text-xs">{formatFileSize(image.file_size)}</span>
                </TableCell>
                
                <TableCell className="w-16">
                  <span className="text-slate-300 text-xs">{image.mime_type?.split('/')[1] || image.mime_type}</span>
                </TableCell>
                
                <TableCell className="w-20">
                  <span className="text-slate-300 text-xs">
                    {new Date(image.uploaded_at).toLocaleDateString('ru-RU')}
                  </span>
                </TableCell>
                
                <TableCell className="min-w-0 max-w-28">
                  <code className="text-xs bg-slate-800/50 backdrop-blur-md border border-white/10 px-1 py-0.5 rounded font-mono text-slate-300 block truncate">
                    {generateShortUrl(image.filename).split('/').pop()}
                  </code>
                </TableCell>
                
                <TableCell className="w-20">
                  <AccessControl
                    accessType={image.access_type || 'public'}
                    onAccessChange={(accessType) => handleAccessChange(image.id, accessType)}
                    size="sm"
                  />
                </TableCell>
                
                <TableCell className="w-24">
                  <div className="flex gap-0.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getPublicUrl(image.filename), '_blank')}
                      className="h-6 w-6 p-0 backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCopyUrl(generateShortUrl(image.filename))}
                      className="h-6 w-6 p-0 backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteImage(image)}
                      className="h-6 w-6 p-0 backdrop-blur-md bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
