
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Images } from "lucide-react";

interface LibraryHeaderProps {
  onBack: () => void;
  selectedCount: number;
  totalCount: number;
  onDeleteSelected: () => void;
}

export const LibraryHeader = ({ onBack, selectedCount, totalCount, onDeleteSelected }: LibraryHeaderProps) => {
  return (
    <div className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад
            </Button>
            
            <div className="flex items-center gap-3">
              <Images className="h-6 w-6 text-white" />
              <h1 className="text-2xl font-bold text-white">Библиотека изображений</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {selectedCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-300">
                  Выбрано: {selectedCount} из {totalCount}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onDeleteSelected}
                  className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить выбранные
                </Button>
              </div>
            )}
            
            <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium">
              {totalCount} файлов
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
