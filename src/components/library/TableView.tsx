
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { ImageData, getPublicUrl, generateShortUrl } from "@/utils/imageUtils";
import { SortField, SortDirection } from "@/pages/Library";

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
  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Н/Д';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
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
              <TableHead className="w-12 min-w-12">
                <Checkbox
                  checked={images.length > 0 && images.every(img => selectedImages.has(img.id))}
                  onCheckedChange={(checked) => {
                    images.forEach(img => onImageSelect(img.id, !!checked));
                  }}
                  className="border-white/30"
                />
              </TableHead>
              <TableHead className="w-16 min-w-16">Превью</TableHead>
              <TableHead className="min-w-48">
                <SortButton field="original_name">Название</SortButton>
              </TableHead>
              <TableHead className="min-w-20">
                <SortButton field="file_size">Размер</SortButton>
              </TableHead>
              <TableHead className="min-w-24">
                <SortButton field="mime_type">Тип</SortButton>
              </TableHead>
              <TableHead className="min-w-32">
                <SortButton field="uploaded_at">Дата загрузки</SortButton>
              </TableHead>
              <TableHead className="min-w-40">Ссылка</TableHead>
              <TableHead className="w-32 min-w-32">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {images.map((image) => (
              <TableRow 
                key={image.id} 
                className="border-white/10 hover:bg-white/5 transition-colors"
              >
                <TableCell className="w-12">
                  <Checkbox
                    checked={selectedImages.has(image.id)}
                    onCheckedChange={(checked) => onImageSelect(image.id, !!checked)}
                    className="border-white/30"
                  />
                </TableCell>
                
                <TableCell className="w-16">
                  <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex-shrink-0">
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
                
                <TableCell>
                  <div className="font-medium text-white truncate max-w-48" title={image.original_name}>
                    {image.original_name}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-slate-300 text-sm">{formatFileSize(image.file_size)}</span>
                </TableCell>
                
                <TableCell>
                  <span className="text-slate-300 text-sm">{image.mime_type?.split('/')[1] || image.mime_type}</span>
                </TableCell>
                
                <TableCell>
                  <span className="text-slate-300 text-sm">
                    {new Date(image.uploaded_at).toLocaleDateString('ru-RU')}
                  </span>
                </TableCell>
                
                <TableCell>
                  <code className="text-xs bg-slate-800/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded font-mono text-slate-300 block truncate max-w-40">
                    {generateShortUrl(image.filename)}
                  </code>
                </TableCell>
                
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getPublicUrl(image.filename), '_blank')}
                      className="h-8 w-8 p-0 backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCopyUrl(generateShortUrl(image.filename))}
                      className="h-8 w-8 p-0 backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteImage(image)}
                      className="h-8 w-8 p-0 backdrop-blur-md bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
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
