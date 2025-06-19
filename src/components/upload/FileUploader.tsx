import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToStorage, saveImageMetadata, checkFileExists } from '@/utils/imageUtils';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface ConflictFile {
  file: File;
  onResolve: (overwrite: boolean) => void;
}

const FileUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'success' | 'error'>>({});
  const [conflictFile, setConflictFile] = useState<ConflictFile | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File, overwrite: boolean = false) => {
    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
      
      const filename = await uploadImageToStorage(file, overwrite);
      setUploadProgress(prev => ({ ...prev, [file.name]: 50 }));
      
      await saveImageMetadata(file, filename, 'public', overwrite);
      setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
      
      toast({
        title: 'Успешно!',
        description: `Файл ${file.name} ${overwrite ? 'перезаписан' : 'загружен'}.`,
      });
    } catch (error) {
      setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
      toast({
        title: 'Ошибка загрузки',
        description: `Не удалось ${overwrite ? 'перезаписать' : 'загрузить'} ${file.name}.`,
        variant: 'destructive',
      });
      console.error(error);
    }
  };

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

      // Проверяем, существует ли файл с таким именем
      const fileExists = await checkFileExists(file.name);
      
      if (fileExists) {
        // Показываем диалог подтверждения
        setConflictFile({
          file,
          onResolve: (overwrite) => {
            setConflictFile(null);
            if (overwrite) {
              handleFileUpload(file, true);
            } else {
              toast({
                title: 'Загрузка отменена',
                description: `Файл ${file.name} уже существует.`,
                variant: 'destructive',
              });
            }
          }
        });
      } else {
        // Загружаем файл как обычно
        await handleFileUpload(file, false);
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
    <>
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

      {/* Диалог подтверждения перезаписи */}
      <AlertDialog open={!!conflictFile} onOpenChange={() => setConflictFile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Файл уже существует</AlertDialogTitle>
            <AlertDialogDescription>
              Файл "{conflictFile?.file.name}" уже существует в системе. 
              Хотите ли вы перезаписать существующий файл?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => conflictFile?.onResolve(false)}>
              Отменить
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => conflictFile?.onResolve(true)}>
              Перезаписать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileUploader;
