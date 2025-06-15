
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { uploadFromUrl, saveImportedImageMetadata } from '@/utils/imageUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface UploadResult {
  url: string;
  status: 'success' | 'error';
  message: string;
}

const UrlUploader = () => {
  const [urls, setUrls] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const { toast } = useToast();

  const handleImport = async () => {
    const urlList = urls.split('\n').map(u => u.trim()).filter(Boolean);
    if (urlList.length === 0) {
      toast({ title: 'Введите хотя бы один URL', variant: 'destructive' });
      return;
    }

    setLoading(true);
    setResults([]);

    const uploadPromises = urlList.map(async (url): Promise<UploadResult> => {
      try {
        const imageData = await uploadFromUrl(url);
        await saveImportedImageMetadata(imageData);
        return { url, status: 'success' as const, message: `Импортировано: ${imageData.original_name}` };
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
        return { url, status: 'error' as const, message: `Ошибка: ${message}` };
      }
    });

    const settledResults = await Promise.all(uploadPromises);
    setResults(settledResults);
    setLoading(false);
    toast({ title: 'Импорт завершен', description: 'Проверьте результаты ниже.' });
  };

  return (
    <div className="space-y-4">
      <div className="p-6 border rounded-xl bg-white dark:bg-gray-900/50 dark:border-gray-800">
        <label htmlFor="url-input" className="block text-sm font-medium mb-2">
          Ссылки на изображения (каждая с новой строки)
        </label>
        <textarea
          id="url-input"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.png"
          className="w-full h-40 p-3 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-md focus:ring-primary focus:border-primary transition"
        />
      </div>
      <Button onClick={handleImport} disabled={loading} className="w-full py-3">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {loading ? 'Импортируем...' : `Импортировать (${urls.split('\n').filter(Boolean).length})`}
      </Button>

      {results.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Результаты импорта</h3>
          {results.map((result, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {result.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="truncate text-sm font-medium" title={result.url}>{result.url}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{result.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlUploader;
