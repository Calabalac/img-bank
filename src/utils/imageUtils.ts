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

export const checkFileExists = async (filename: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('images')
    .select('id')
    .eq('filename', filename)
    .maybeSingle();

  if (error) {
    console.error('Error checking file existence:', error);
    return false;
  }

  return !!data;
};

export const uploadImageToStorage = async (file: File, overwrite: boolean = false): Promise<string> => {
  const filename = file.name;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filename, file, {
      upsert: overwrite
    });

  if (error) {
    throw new Error(`Upload error: ${error.message}`);
  }

  return filename;
};

export const uploadFromUrl = async (imageUrl: string): Promise<{ filename: string; original_name: string; file_size: number; mime_type: string; }> => {
  const { data, error } = await supabase.functions.invoke('upload-from-url', {
    body: { imageUrl },
  });

  if (error) {
    throw new Error(`URL import error: ${error.message}`);
  }
  
  if (data.error) {
    throw new Error(`URL import error: ${data.error}`);
  }

  return data;
};

export const saveImageMetadata = async (file: File, filename: string, accessType: 'public' | 'private' | 'shared' = 'public', overwrite: boolean = false): Promise<ImageData> => {
  const shortUrl = generateShortUrl(filename);
  const user = await supabase.auth.getUser();
  
  if (overwrite) {
    // Удаляем существующую запись если перезаписываем
    await supabase
      .from('images')
      .delete()
      .eq('filename', filename);
  }
  
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
    throw new Error(`Error saving metadata: ${error.message}`);
  }

  return data;
};

export const saveImportedImageMetadata = async (
  imageData: {
    filename: string;
    original_name: string;
    file_size: number;
    mime_type: string;
  },
  accessType: 'public' | 'private' | 'shared' = 'private',
  overwrite: boolean = false
): Promise<ImageData> => {
  const shortUrl = generateShortUrl(imageData.filename);
  const user = await supabase.auth.getUser();
  
  if (overwrite) {
    // Удаляем существующую запись если перезаписываем
    await supabase
      .from('images')
      .delete()
      .eq('filename', imageData.filename);
  }
  
  const { data, error } = await supabase
    .from('images')
    .insert({
      filename: imageData.filename,
      original_name: imageData.original_name,
      file_path: imageData.filename,
      file_size: imageData.file_size,
      mime_type: imageData.mime_type,
      short_url: shortUrl,
      user_id: user.data.user?.id || null,
      access_type: accessType
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error saving metadata: ${error.message}`);
  }

  return data;
};

export const updateImageAccess = async (imageId: string, accessType: 'public' | 'private' | 'shared'): Promise<void> => {
  const { error } = await supabase
    .from('images')
    .update({ access_type: accessType })
    .eq('id', imageId);

  if (error) {
    throw new Error(`Error updating access: ${error.message}`);
  }
};

export const getImageByShortUrl = async (shortUrl: string): Promise<ImageData | null> => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('short_url', shortUrl)
    .maybeSingle();

  if (error) {
    console.error('Error searching for image:', error);
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
    throw new Error(`Error loading images: ${error.message}`);
  }

  return data || [];
};

export const deleteImage = async (imageId: string, filename: string): Promise<void> => {
  const { error: storageError } = await supabase.storage
    .from('images')
    .remove([filename]);

  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
  }

  const { error: dbError } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId);

  if (dbError) {
    throw new Error(`Error deleting record: ${dbError.message}`);
  }
};

export const getPublicUrl = (filename: string): string => {
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filename);
  
  return data.publicUrl;
};
