
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Eye } from "lucide-react";
import { ImageData, getPublicUrl, generateShortUrl } from "@/utils/imageUtils";

interface ListViewProps {
  images: ImageData[];
  selectedImages: Set<string>;
  onImageSelect: (imageId: string, selected: boolean) => void;
  onCopyUrl: (url: string) => void;
  onDeleteImage: (image: ImageData) => void;
}

export const ListView = ({
  images,
  selectedImages,
  onImageSelect,
  onCopyUrl,
  onDeleteImage
}: ListViewProps) => {
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

  return (
    <div className="space-y-3">
      {images.map((image) => (
        <Card
          key={image.id}
          className="backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <div className="p-4 flex items-center gap-4">
            {/* Checkbox */}
            <Checkbox
              checked={selectedImages.has(image.id)}
              onCheckedChange={(checked) => onImageSelect(image.id, !!checked)}
              className="border-white/30"
            />

            {/* Thumbnail */}
            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={getPublicUrl(image.filename)}
                alt={image.original_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM2NjYiLz4KPHA+PC9wPgo8L3N2Zz4K';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate mb-1">
                {image.original_name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>{formatFileSize(image.file_size)}</span>
                <span>{new Date(image.uploaded_at).toLocaleString('ru-RU')}</span>
                <span className="truncate">{image.mime_type}</span>
              </div>
            </div>

            {/* URL */}
            <div className="flex-1 min-w-0">
              <code className="text-xs bg-slate-800/50 backdrop-blur-md border border-white/10 px-3 py-2 rounded block truncate font-mono text-slate-300">
                {generateShortUrl(image.filename)}
              </code>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(getPublicUrl(image.filename), '_blank')}
                className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopyUrl(generateShortUrl(image.filename))}
                className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDeleteImage(image)}
                className="backdrop-blur-md bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
