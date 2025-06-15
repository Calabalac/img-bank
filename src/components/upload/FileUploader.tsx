
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, saveImageMetadata } from '@/utils/imageUtils';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const FileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'success' | 'error'>>({});
  const { toast } = useToast();

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Неверный тип файла',
          description: `${file.name} не является изображением.`,
          variant: 'destructive',
        });
        continue;
      }

      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      try {
        const filename = await uploadImageToStorage(file);
        setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
        
        await saveImageMetadata(file, filename);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
        toast({
          title: 'Успешно!',
          description: `Файл ${file.name} загружен.`,
        });
      } catch (error) {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        toast({
          title: 'Ошибка загрузки',
          description: `Не удалось загрузить ${file.name}.`,
          variant: 'destructive',
        });
        console.error(error);
      }
    }
  }, [toast]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-700 hover:border-primary/50'}`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-4 text-gray-500 dark:text-gray-400">
          <UploadCloud className={`w-16 h-16 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`} />
          <p className="text-lg font-medium">Перетащите файлы сюда или нажмите для выбора</p>
          <p className="text-sm">Максимальный размер файла: 10МБ</p>
        </div>
      </div>
      
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Статус загрузок</h3>
          {Object.entries(uploadProgress).map(([name, progress]) => (
            <div key={name} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <p className="truncate text-sm font-medium flex-1">{name}</p>
                {uploadStatus[name] === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {uploadStatus[name] === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                {progress < 100 && !uploadStatus[name] && (
                  <p className="text-sm text-gray-500">{Math.round(progress)}%</p>
                )}
              </div>
              {progress < 100 && !uploadStatus[name] && (
                <Progress value={progress} className="h-2 mt-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
