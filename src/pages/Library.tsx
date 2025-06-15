import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  ImageData,
  getAllImages, 
  deleteImage, 
  saveImportedImageMetadata,
  generateShortUrl 
} from "@/utils/imageUtils";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { GalleryView } from "@/components/library/GalleryView";
import { ListView } from "@/components/library/ListView";
import { TableView } from "@/components/library/TableView";
import { FolderManager } from "@/components/library/FolderManager";
import { DragDropProvider } from "@/components/library/DragDropProvider";
import { useAuth } from "@/hooks/useAuth";
import { getFolderImages } from "@/utils/folderUtils";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";

export type SortField = 'original_name' | 'uploaded_at' | 'file_size' | 'mime_type';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'gallery' | 'list' | 'table';

const Library = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [gridColumns, setGridColumns] = useState(4);
  const [sortField, setSortField] = useState<SortField>('uploaded_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foldersRefresh, setFoldersRefresh] = useState(0);
  const [isUploadByUrlModalOpen, setUploadByUrlModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadImages();
  }, [user, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        const imageIds = new Set(filteredImages.map(img => img.id));
        setSelectedImages(imageIds);
        toast({
          title: "Выделено",
          description: `Выделено ${imageIds.size} изображений`,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredImages, toast]);

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const loadedImages = await getAllImages();
      setImages(loadedImages);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображения",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sortedAndFilteredImages = useMemo(async () => {
    let result = [...images];

    // Фильтрация по папке
    if (selectedFolder) {
      try {
        const folderImageIds = await getFolderImages(selectedFolder);
        result = result.filter(img => folderImageIds.includes(img.id));
      } catch (error) {
        console.error('Ошибка загрузки изображений папки:', error);
        result = [];
      }
    }

    // Поиск
    if (searchQuery) {
      result = result.filter(img => 
        img.original_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
    result.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'uploaded_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortField === 'file_size') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [images, searchQuery, sortField, sortDirection, selectedFolder]);

  useEffect(() => {
    if (sortedAndFilteredImages instanceof Promise) {
      sortedAndFilteredImages.then(setFilteredImages);
    } else {
      setFilteredImages(sortedAndFilteredImages);
    }
  }, [sortedAndFilteredImages]);

  const handleImageSelect = (imageId: string, selected: boolean) => {
    const newSelected = new Set(selectedImages);
    if (selected) {
      newSelected.add(imageId);
    } else {
      newSelected.delete(imageId);
    }
    setSelectedImages(newSelected);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  const handleDeleteImage = async (imageData: ImageData) => {
    try {
      await deleteImage(imageData.id, imageData.filename);
      setImages(prev => prev.filter(img => img.id !== imageData.id));
      setSelectedImages(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(imageData.id);
        return newSelected;
      });
      
      toast({
        title: "Изображение удалено",
        description: "Изображение удалено из библиотеки",
      });
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить изображение",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;

    try {
      const imagesToDelete = images.filter(img => selectedImages.has(img.id));
      
      for (const image of imagesToDelete) {
        await deleteImage(image.id, image.filename);
      }

      setImages(prev => prev.filter(img => !selectedImages.has(img.id)));
      
      toast({
        title: "Изображения удалены",
        description: `Удалено ${selectedImages.size} изображений`,
      });

      setSelectedImages(new Set());
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить изображения",
        variant: "destructive",
      });
    }
  };

  const handleFoldersChange = () => {
    setFoldersRefresh(prev => prev + 1);
    loadImages(); // Перезагружаем изображения при изменении папок
  };

  if (!user) {
    return null; // Компонент перенаправит на авторизацию
  }

  return (
    <DragDropProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <LibraryHeader 
          onBack={() => navigate('/')}
          selectedCount={selectedImages.size}
          totalCount={filteredImages.length}
          onDeleteSelected={handleDeleteSelected}
        />

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <FolderManager
                selectedFolder={selectedFolder}
                setSelectedFolder={setSelectedFolder}
                selectedImages={selectedImages}
                images={images}
                onFoldersChange={handleFoldersChange}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start">
                <div className="flex-grow">
                  <LibraryFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    gridColumns={gridColumns}
                    setGridColumns={setGridColumns}
                    sortField={sortField}
                    setSortField={setSortField}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                  />
                </div>
                <Button variant="outline" className="shrink-0 bg-slate-800 border-slate-700 hover:bg-slate-700" onClick={() => setUploadByUrlModalOpen(true)}>
                  <Link2 className="h-4 w-4 mr-2" />
                  Загрузить по URL
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  <span className="text-white text-lg ml-4">Загрузка изображений...</span>
                </div>
              ) : (
                <div>
                  {viewMode === 'gallery' && (
                    <GalleryView
                      images={filteredImages}
                      selectedImages={selectedImages}
                      onImageSelect={handleImageSelect}
                      gridColumns={gridColumns}
                      onCopyUrl={(url) => copyToClipboard(url)}
                      onDeleteImage={handleDeleteImage}
                    />
                  )}
                  
                  {viewMode === 'list' && (
                    <ListView
                      images={filteredImages}
                      selectedImages={selectedImages}
                      onImageSelect={handleImageSelect}
                      onCopyUrl={(url) => copyToClipboard(url)}
                      onDeleteImage={handleDeleteImage}
                    />
                  )}
                  
                  {viewMode === 'table' && (
                    <TableView
                      images={filteredImages}
                      selectedImages={selectedImages}
                      onImageSelect={handleImageSelect}
                      onCopyUrl={(url) => copyToClipboard(url)}
                      onDeleteImage={handleDeleteImage}
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={(field) => {
                        if (field === sortField) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField(field);
                          setSortDirection('asc');
                        }
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <UploadByUrlModal
        isOpen={isUploadByUrlModalOpen}
        onOpenChange={setUploadByUrlModalOpen}
        onUploadComplete={loadImages}
      />
    </DragDropProvider>
  );
};

interface UploadByUrlModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUploadComplete: () => void;
}

const UploadByUrlModal = ({ isOpen, onOpenChange, onUploadComplete }: UploadByUrlModalProps) => {
  const [links, setLinks] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentUpload, setCurrentUpload] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const { toast } = useToast();

  const handleUpload = async () => {
    const urls = links.split('\n').map(link => link.trim()).filter(link => link.startsWith('http'));
    if (urls.length === 0) {
      toast({ title: 'Нет корректных ссылок для загрузки', description: "Убедитесь, что ссылки начинаются с http или https", variant: 'destructive' });
      return;
    }

    setIsUploading(true);
    setTotalUploads(urls.length);
    setCurrentUpload(0);
    setProgress(0);

    let successfulUploads = 0;

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      setCurrentUpload(i + 1);
      try {
        const { data, error: functionError } = await supabase.functions.invoke('upload-from-url', {
          body: { imageUrl: url },
        });

        if (functionError) {
          throw functionError;
        }

        await saveImportedImageMetadata(data, 'private');
        successfulUploads++;
      } catch (error) {
        console.error(`Failed to upload from ${url}`, error);
        toast({
          title: `Ошибка при загрузке`,
          description: (error as Error).message,
          variant: 'destructive',
        });
      }
      setProgress(((i + 1) / urls.length) * 100);
    }

    setIsUploading(false);
    setLinks('');

    if (successfulUploads > 0) {
      onUploadComplete();
    }
    
    if (successfulUploads === urls.length) {
      onOpenChange(false);
      toast({
        title: 'Загрузка завершена',
        description: `Успешно загружено ${successfulUploads} из ${urls.length} изображений.`,
      });
    } else {
       toast({
        title: 'Загрузка завершена с ошибками',
        description: `Успешно загружено ${successfulUploads} из ${urls.length}. Проверьте консоль для деталей.`,
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    onOpenChange(false);
    setLinks('');
    setProgress(0);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Загрузить изображения по URL</DialogTitle>
          <DialogDescription className="text-slate-400">
            Вставьте ссылки на изображения, каждую на новой строке.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="https://example.com/image1.png&#10;https://example.com/image2.jpg"
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          rows={10}
          disabled={isUploading}
          className="bg-slate-800 border-slate-700 focus:ring-slate-500"
        />
        {isUploading && (
          <div className="space-y-2">
            <Progress value={progress} className="[&>*]:bg-blue-500" />
            <p className="text-sm text-center text-slate-400">
              Загрузка {currentUpload} из {totalUploads}...
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading} className="bg-slate-800 border-slate-700 hover:bg-slate-700">
            Отмена
          </Button>
          <Button onClick={handleUpload} disabled={isUploading || !links.trim()} className="bg-blue-600 hover:bg-blue-700">
            {isUploading ? 'Загрузка...' : 'Загрузить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default Library;
