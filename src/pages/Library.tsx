
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, Search, Grid3X3, List, Table, Copy, Trash2, Eye,
  Filter, FolderPlus, Folder, MoreVertical, Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  ImageData,
  getAllImages, 
  deleteImage, 
  getPublicUrl,
  generateShortUrl 
} from "@/utils/imageUtils";
import { LibraryHeader } from "@/components/library/LibraryHeader";
import { LibraryFilters } from "@/components/library/LibraryFilters";
import { GalleryView } from "@/components/library/GalleryView";
import { ListView } from "@/components/library/ListView";
import { TableView } from "@/components/library/TableView";
import { FolderManager } from "@/components/library/FolderManager";

export type SortField = 'original_name' | 'uploaded_at' | 'file_size' | 'mime_type';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'gallery' | 'list' | 'table';

export interface Folder {
  id: string;
  name: string;
  imageIds: string[];
  color: string;
}

const Library = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [gridColumns, setGridColumns] = useState(4);
  const [sortField, setSortField] = useState<SortField>('uploaded_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    // Обработка Ctrl+A для выделения всех изображений
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

  // Фильтрация и сортировка изображений
  const sortedAndFilteredImages = useMemo(() => {
    let result = [...images];

    // Фильтрация по папке
    if (selectedFolder) {
      const folder = folders.find(f => f.id === selectedFolder);
      if (folder) {
        result = result.filter(img => folder.imageIds.includes(img.id));
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
  }, [images, searchQuery, sortField, sortDirection, selectedFolder, folders]);

  useEffect(() => {
    setFilteredImages(sortedAndFilteredImages);
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
      
      // Удаляем из всех папок
      setFolders(prev => prev.map(folder => ({
        ...folder,
        imageIds: folder.imageIds.filter(id => id !== imageData.id)
      })));

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
      setFolders(prev => prev.map(folder => ({
        ...folder,
        imageIds: folder.imageIds.filter(id => !selectedImages.has(id))
      })));
      
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

  return (
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
              folders={folders}
              setFolders={setFolders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              selectedImages={selectedImages}
              images={images}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
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

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="text-white text-lg ml-4">Загрузка изображений...</span>
              </div>
            ) : (
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <TabsContent value="gallery">
                  <GalleryView
                    images={filteredImages}
                    selectedImages={selectedImages}
                    onImageSelect={handleImageSelect}
                    gridColumns={gridColumns}
                    onCopyUrl={(url) => copyToClipboard(url)}
                    onDeleteImage={handleDeleteImage}
                  />
                </TabsContent>
                
                <TabsContent value="list">
                  <ListView
                    images={filteredImages}
                    selectedImages={selectedImages}
                    onImageSelect={handleImageSelect}
                    onCopyUrl={(url) => copyToClipboard(url)}
                    onDeleteImage={handleDeleteImage}
                  />
                </TabsContent>
                
                <TabsContent value="table">
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
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
