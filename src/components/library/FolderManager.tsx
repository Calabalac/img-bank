import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FolderPlus, Folder, FolderOpen, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Folder as FolderType } from "@/pages/Library";
import { ImageData } from "@/utils/imageUtils";

interface FolderManagerProps {
  folders: FolderType[];
  setFolders: (folders: FolderType[]) => void;
  selectedFolder: string | null;
  setSelectedFolder: (folderId: string | null) => void;
  selectedImages: Set<string>;
  images: ImageData[];
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
  folders,
  setFolders,
  selectedFolder,
  setSelectedFolder,
  selectedImages,
  images
}: FolderManagerProps) => {
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FolderType = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      imageIds: [],
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setIsCreating(false);

    toast({
      title: "Папка создана",
      description: `Папка "${newFolder.name}" создана`,
    });
  };

  const deleteFolder = (folderId: string) => {
    setFolders(folders.filter(f => f.id !== folderId));
    if (selectedFolder === folderId) {
      setSelectedFolder(null);
    }

    toast({
      title: "Папка удалена",
      description: "Папка удалена (изображения остались в библиотеке)",
    });
  };

  const addImagesToFolder = (folderId: string, imageIds: string[]) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        const newImageIds = [...new Set([...folder.imageIds, ...imageIds])];
        return { ...folder, imageIds: newImageIds };
      }
      return folder;
    }));

    toast({
      title: "Изображения добавлены",
      description: `Добавлено ${imageIds.length} изображений в папку`,
    });
  };

  const removeImagesFromFolder = (folderId: string, imageIds: string[]) => {
    setFolders(folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          imageIds: folder.imageIds.filter(id => !imageIds.includes(id))
        };
      }
      return folder;
    }));

    toast({
      title: "Изображения удалены",
      description: "Изображения удалены из папки",
    });
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
        {/* All Images */}
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

        {/* Existing Folders */}
        {folders.map((folder) => (
          <div key={folder.id} className="space-y-2">
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
                {folder.imageIds.length}
              </Badge>
            </Button>

            {selectedFolder === folder.id && (
              <div className="pl-4 space-y-2">
                {selectedImages.size > 0 && (
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => addImagesToFolder(folder.id, Array.from(selectedImages))}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Добавить
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeImagesFromFolder(folder.id, Array.from(selectedImages))}
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
                  onClick={() => deleteFolder(folder.id)}
                  className="w-full bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Удалить папку
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Create New Folder */}
        {isCreating ? (
          <div className="space-y-2">
            <Input
              placeholder="Название папки"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') createFolder();
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
                onClick={createFolder}
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
              Выберите папку выше и нажмите "Добавить" для перемещения
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
