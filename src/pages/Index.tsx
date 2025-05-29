import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileImage, 
  Link as LinkIcon, 
  CheckCircle, 
  XCircle, 
  Copy, 
  Eye,
  Library,
  LogOut,
  LogIn
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  uploadImageToStorage, 
  saveImageMetadata, 
  generateShortUrl, 
  getPublicUrl,
  ImageData 
} from "@/utils/imageUtils";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [urlText, setUrlText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    success: ImageData[];
    failed: { name: string; error: string }[];
  }>({ success: [], failed: [] });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось выйти из системы",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (selectedFiles: File[]) => {
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== selectedFiles.length) {
      toast({
        title: "Внимание",
        description: `Выбраны только изображения (${imageFiles.length} из ${selectedFiles.length})`,
        variant: "destructive",
      });
    }
    setFiles(imageFiles);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileSelect(droppedFiles);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleUrlUpload = async () => {
    if (!urlText.trim()) return;

    const urls = urlText.split('\n').filter(url => url.trim());
    if (urls.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    const results = { success: [] as ImageData[], failed: [] as { name: string; error: string }[] };

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim();
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) {
          throw new Error('Не является изображением');
        }

        const filename = url.split('/').pop() || `image_${Date.now()}.jpg`;
        const file = new File([blob], filename, { type: blob.type });
        
        const uploadedFilename = await uploadImageToStorage(file);
        const imageData = await saveImageMetadata(file, uploadedFilename, user ? 'private' : 'public');
        results.success.push(imageData);
      } catch (error) {
        results.failed.push({
          name: url,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        });
      }
      
      setUploadProgress(((i + 1) / urls.length) * 100);
    }

    setUploadResults(results);
    setIsUploading(false);
    setUrlText("");

    if (results.success.length > 0) {
      toast({
        title: "Загрузка завершена",
        description: `Загружено: ${results.success.length}, ошибок: ${results.failed.length}`,
      });
    }
  };

  const handleFileUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    const results = { success: [] as ImageData[], failed: [] as { name: string; error: string }[] };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const uploadedFilename = await uploadImageToStorage(file);
        const imageData = await saveImageMetadata(file, uploadedFilename, user ? 'private' : 'public');
        results.success.push(imageData);
      } catch (error) {
        results.failed.push({
          name: file.name,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        });
      }
      
      setUploadProgress(((i + 1) / files.length) * 100);
    }

    setUploadResults(results);
    setIsUploading(false);
    setFiles([]);

    if (results.success.length > 0) {
      toast({
        title: "Загрузка завершена",
        description: `Загружено: ${results.success.length}, ошибок: ${results.failed.length}`,
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Ссылка скопирована в буфер обмена",
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-md bg-white/5 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FileImage className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Image Hub</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/library')}
                variant="outline"
                className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
              >
                <Library className="h-4 w-4 mr-2" />
                Библиотека
              </Button>
              
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-300">{user.email}</span>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Войти
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Загрузите и поделитесь изображениями
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Простой и быстрый способ загружать изображения и получать короткие ссылки для обмена
          </p>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* File Upload */}
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="h-5 w-5" />
                Загрузка файлов
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-white/40 hover:bg-white/5"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileImage className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">
                  Перетащите файлы или нажмите для выбора
                </p>
                <p className="text-slate-400 text-sm">
                  Поддерживаются изображения всех популярных форматов
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
                className="hidden"
              />

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-white">Выбранные файлы ({files.length})</Label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/5 rounded p-2 text-sm">
                        <span className="text-white truncate">{file.name}</span>
                        <span className="text-slate-400 ml-2">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isUploading ? `Загружаем... ${Math.round(uploadProgress)}%` : "Загрузить файлы"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* URL Upload */}
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <LinkIcon className="h-5 w-5" />
                Загрузка по ссылкам
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="urls" className="text-white">
                  URL изображений (по одному на строку)
                </Label>
                <Textarea
                  id="urls"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png"
                  value={urlText}
                  onChange={(e) => setUrlText(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 min-h-32"
                />
              </div>
              
              <Button
                onClick={handleUrlUpload}
                disabled={!urlText.trim() || isUploading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isUploading ? `Загружаем... ${Math.round(uploadProgress)}%` : "Загрузить по ссылкам"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        {isUploading && (
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 mb-8">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Прогресс загрузки</span>
                  <span className="text-slate-300">{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {(uploadResults.success.length > 0 || uploadResults.failed.length > 0) && (
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Результаты загрузки</CardTitle>
            </CardHeader>
            <CardContent>
              {uploadResults.success.length > 0 && (
                <div className="space-y-4 mb-6">
                  <h3 className="text-green-400 font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Успешно загружено ({uploadResults.success.length})
                  </h3>
                  <div className="grid gap-3">
                    {uploadResults.success.map((image, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={getPublicUrl(image.filename)}
                            alt={image.original_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{image.original_name}</p>
                          <code className="text-xs bg-slate-800/50 px-2 py-1 rounded font-mono text-green-300">
                            {generateShortUrl(image.filename)}
                          </code>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(getPublicUrl(image.filename), '_blank')}
                            className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(generateShortUrl(image.filename))}
                            className="backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 text-white"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadResults.failed.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-red-400 font-medium flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Ошибки загрузки ({uploadResults.failed.length})
                  </h3>
                  <div className="space-y-2">
                    {uploadResults.failed.map((error, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="text-white truncate">{error.name}</span>
                        <Badge variant="destructive" className="ml-2 flex-shrink-0">
                          {error.error}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
