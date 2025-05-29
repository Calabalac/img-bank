
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, Folder, FolderOpen, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageData } from "@/utils/imageUtils";
import { DatabaseFolder, createFolder, getUserFolders, deleteFolder as deleteFolderDB, addImagesToFolder, removeImagesFromFolder, getFolderImages, updateFolder } from "@/utils/folderUtils";
import { AccessControl } from "./AccessControl";
import { useDragDrop } from "./DragDropProvider";

interface FolderManagerProps {
  selectedFolder: string | null;
  setSelectedFolder: (folderId: string | null) => void;
  selectedImages: Set<string>;
  images: ImageData[];
  onFoldersChange: () => void;
}

const colors = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500'
];

export const FolderManager = ({
  selectedFolder,
  setSelectedFolder,
  selectedImages,
  images,
  onFoldersChange
}: FolderManagerProps) => {
  const [folders, setFolders] = useState<DatabaseFolder[]>([]);
  const [folderImageCounts, setFolderImageCounts] = useState<Record<string, number>>({});
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { draggedItems, isDragging } = useDragDrop();

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    loadFolderCounts();
  }, [folders]);

  const loadFolders = async () => {
    try {
      setLoading(true);
      const loadedFolders = await getUserFolders();
      setFolders(loadedFolders);
    } catch (error) {
      console.error('Ошибка загрузки папок:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить папки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFolderCounts = async () => {
    const counts: Record<string, number> = {};
    for (const folder of folders) {
      try {
        const imageIds = await getFolderImages(folder.id);
        counts[folder.id] = imageIds.length;
      } catch (error) {
        counts[folder.id] = 0;
      }
    }
    setFolderImageCounts(counts);
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const newFolder = await createFolder(
        newFolderName.trim(),
        colors[Math.floor(Math.random() * colors.length)]
      );

      setFolders([newFolder, ...folders]);
      setNewFolderName("");
      setIsCreating(false);
      onFoldersChange();

      toast({
        title: "Папка создана",
        description: `Папка "${newFolder.name}" создана`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать папку",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolderDB(folderId);
      setFolders(folders.filter(f => f.id !== folderId));
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
      onFoldersChange();

      toast({
        title: "Папка удалена",
        description: "Папка удалена (изображения остались в библиотеке)",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить папку",
        variant: "destructive",
      });
    }
  };

  const handleAddImagesToFolder = async (folderId: string, imageIds: string[]) => {
    try {
      await addImagesToFolder(folderId, imageIds);
      loadFolderCounts();
      onFoldersChange();

      toast({
        title: "Изображения добавлены",
        description: `Добавлено ${imageIds.length} изображений в папку`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить изображения в папку",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImagesFromFolder = async (folderId: string, imageIds: string[]) => {
    try {
      await removeImagesFromFolder(folderId, imageIds);
      loadFolderCounts();
      onFoldersChange();

      toast({
        title: "Изображения удалены",
        description: "Изображения удалены из папки",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить изображения из папки",
        variant: "destructive",
      });
    }
  };

  const handleAccessChange = async (folderId: string, accessType: 'public' | 'private' | 'shared') => {
    try {
      await updateFolder(folderId, { access_type: accessType });
      setFolders(folders.map(f => f.id === folderId ? { ...f, access_type: accessType } : f));
      
      toast({
        title: "Доступ обновлен",
        description: `Папка теперь ${accessType === 'public' ? 'публичная' : accessType === 'shared' ? 'для друзей' : 'приватная'}`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить доступ",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (draggedItems.length > 0) {
      handleAddImagesToFolder(folderId, draggedItems);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="backdrop-blur-md bg-white/5 border border-white/10 sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Folder className="h-5 w-5" />
          Папки
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant={selectedFolder === null ? 'default' : 'ghost'}
          onClick={() => setSelectedFolder(null)}
          className={`w-full justify-start ${
            selectedFolder === null 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Все изображения
          <Badge variant="secondary" className="ml-auto bg-white/10 text-white">
            {images.length}
          </Badge>
        </Button>

        {loading ? (
          <div className="text-center text-slate-400">Загрузка...</div>
        ) : (
          folders.map((folder) => (
            <div key={folder.id} className="space-y-2">
              <div 
                className={`rounded-lg p-2 transition-colors ${
                  isDragging ? 'border-2 border-dashed border-blue-500/50 bg-blue-500/10' : ''
                }`}
                onDrop={(e) => handleDrop(e, folder.id)}
                onDragOver={handleDragOver}
              >
                <Button
                  variant={selectedFolder === folder.id ? 'default' : 'ghost'}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full justify-start ${
                    selectedFolder === folder.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-2 ${folder.color}`}></div>
                  <span className="truncate">{folder.name}</span>
                  <Badge variant="secondary" className="ml-auto bg-white/10 text-white">
                    {folderImageCounts[folder.id] || 0}
                  </Badge>
                </Button>

                <div className="mt-2 flex items-center justify-between">
                  <AccessControl
                    accessType={folder.access_type}
                    onAccessChange={(accessType) => handleAccessChange(folder.id, accessType)}
                    size="sm"
                  />
                </div>
              </div>

              {selectedFolder === folder.id && (
                <div className="pl-4 space-y-2">
                  {selectedImages.size > 0 && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleAddImagesToFolder(folder.id, Array.from(selectedImages))}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Добавить
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveImagesFromFolder(folder.id, Array.from(selectedImages))}
                        className="flex-1 bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Убрать
                      </Button>
                    </div>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteFolder(folder.id)}
                    className="w-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Удалить папку
                  </Button>
                </div>
              )}
            </div>
          ))
        )}

        {isCreating ? (
          <div className="space-y-2">
            <Input
              placeholder="Название папки"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewFolderName("");
                }
              }}
              className="bg-white/5 border-white/20 text-white"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateFolder}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Создать
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewFolderName("");
                }}
                className="flex-1 bg-white/5 border-white/20 hover:bg-white/10 text-white"
              >
                Отмена
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsCreating(true)}
            className="w-full bg-white/5 border-white/20 hover:bg-white/10 text-white"
          >
            <FolderPlus className="h-4 w-4 mr-2" />
            Создать папку
          </Button>
        )}

        {selectedImages.size > 0 && (
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400 mb-2">
              Выбрано изображений: {selectedImages.size}
            </p>
            <p className="text-xs text-slate-500">
              Перетащите изображения на папку или используйте кнопки выше
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
