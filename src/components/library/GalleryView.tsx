
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Copy, Trash2, Eye, Download } from "lucide-react";
import { ImageData, getPublicUrl, generateShortUrl } from "@/utils/imageUtils";

interface GalleryViewProps {
  images: ImageData[];
  selectedImages: Set<string>;
  onImageSelect: (imageId: string, selected: boolean) => void;
  gridColumns: number;
  onCopyUrl: (url: string) => void;
  onDeleteImage: (image: ImageData) => void;
}

export const GalleryView = ({
  images,
  selectedImages,
  onImageSelect,
  gridColumns,
  onCopyUrl,
  onDeleteImage
}: GalleryViewProps) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Н/Д';
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const gridClass = {
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
  }[gridColumns];

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-slate-400 text-lg">Изображения не найдены</div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${gridClass}`}>
      {images.map((image) => (
        <Card
          key={image.id}
          className="group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-2xl"
          onMouseEnter={() => setHoveredImage(image.id)}
          onMouseLeave={() => setHoveredImage(null)}
        >
          {/* Selection Checkbox */}
          <div className="absolute top-3 left-3 z-10">
            <div className="backdrop-blur-md bg-black/50 rounded-lg p-1">
              <Checkbox
                checked={selectedImages.has(image.id)}
                onCheckedChange={(checked) => onImageSelect(image.id, !!checked)}
                className="border-white/30"
              />
            </div>
          </div>

          {/* Image */}
          <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
            <img
              src={getPublicUrl(image.filename)}
              alt={image.original_name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjMzMzIi8+CjxwYXRoIGQ9Ik04NS41IDQ1SDExNC41VjQ3LjVIODUuNVY0NVoiIGZpbGw9IiM2NjYiLz4KPHA+PC9wPgo8L3N2Zz4K';
              }}
            />
            
            {/* Hover Overlay */}
            {hoveredImage === image.id && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(getPublicUrl(image.filename), '_blank')}
                    className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyUrl(generateShortUrl(image.filename))}
                    className="backdrop-blur-md bg-white/10 border-white/20 hover:bg-white/20 text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDeleteImage(image)}
                    className="backdrop-blur-md bg-red-500/20 border-red-500/30 hover:bg-red-500/30 text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-3">
            <h3 className="font-medium text-sm text-white truncate" title={image.original_name}>
              {image.original_name}
            </h3>
            
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{formatFileSize(image.file_size)}</span>
              <span>{new Date(image.uploaded_at).toLocaleDateString('ru-RU')}</span>
            </div>
            
            <code className="text-xs bg-slate-800/50 backdrop-blur-md border border-white/10 px-2 py-1 rounded block truncate font-mono text-slate-300">
              {generateShortUrl(image.filename)}
            </code>
          </div>
        </Card>
      ))}
    </div>
  );
};
