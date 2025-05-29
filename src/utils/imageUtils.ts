import { supabase } from "@/integrations/supabase/client";

export interface ImageData {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  short_url: string;
  uploaded_at: string;
  user_id?: string | null;
  access_type?: 'public' | 'private' | 'shared';
}

export const generateShortUrl = (filename: string) => {
  return `https://jafuyqfmcpilcvzzmmwq.supabase.co/functions/v1/image-redirect/${filename}`;
};

export const generateUniqueFilename = (originalName: string) => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  return `${timestamp}_${randomStr}.${extension}`;
};

export const uploadImageToStorage = async (file: File): Promise<string> => {
  const filename = generateUniqueFilename(file.name);
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filename, file);

  if (error) {
    throw new Error(`Ошибка загрузки файла: ${error.message}`);
  }

  return filename;
};

export const saveImageMetadata = async (file: File, filename: string, accessType: 'public' | 'private' | 'shared' = 'public'): Promise<ImageData> => {
  const shortUrl = generateShortUrl(filename);
  const user = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('images')
    .insert({
      filename,
      original_name: file.name,
      file_path: filename,
      file_size: file.size,
      mime_type: file.type,
      short_url: shortUrl,
      user_id: user.data.user?.id || null,
      access_type: accessType
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Ошибка сохранения метаданных: ${error.message}`);
  }

  return data;
};

export const updateImageAccess = async (imageId: string, accessType: 'public' | 'private' | 'shared'): Promise<void> => {
  const { error } = await supabase
    .from('images')
    .update({ access_type: accessType })
    .eq('id', imageId);

  if (error) {
    throw new Error(`Ошибка обновления доступа: ${error.message}`);
  }
};

export const getImageByShortUrl = async (shortUrl: string): Promise<ImageData | null> => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('short_url', shortUrl)
    .maybeSingle();

  if (error) {
    console.error('Ошибка поиска изображения:', error);
    return null;
  }

  return data;
};

export const getAllImages = async (): Promise<ImageData[]> => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) {
    throw new Error(`Ошибка загрузки изображений: ${error.message}`);
  }

  return data || [];
};

export const deleteImage = async (imageId: string, filename: string): Promise<void> => {
  const { error: storageError } = await supabase.storage
    .from('images')
    .remove([filename]);

  if (storageError) {
    console.error('Ошибка удаления файла из хранилища:', storageError);
  }

  const { error: dbError } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    throw new Error(`Ошибка удаления записи: ${dbError.message}`);
  }
};

export const getPublicUrl = (filename: string): string => {
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filename);
  
  return data.publicUrl;
};
