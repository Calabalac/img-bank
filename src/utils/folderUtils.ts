
import { supabase } from "@/integrations/supabase/client";

export interface DatabaseFolder {
  id: string;
  name: string;
  color: string;
  access_type: 'public' | 'private' | 'shared';
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FolderImage {
  id: string;
  folder_id: string;
  image_id: string;
  created_at: string;
}

export const createFolder = async (name: string, color: string, accessType: 'public' | 'private' | 'shared' = 'private'): Promise<DatabaseFolder> => {
  const { data, error } = await supabase
    .from('folders')
    .insert({
      name,
      color,
      access_type: accessType,
      user_id: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Ошибка создания папки: ${error.message}`);
  }

  return data;
};

export const getUserFolders = async (): Promise<DatabaseFolder[]> => {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Ошибка загрузки папок: ${error.message}`);
  }

  return data || [];
};

export const updateFolder = async (id: string, updates: Partial<DatabaseFolder>): Promise<DatabaseFolder> => {
  const { data, error } = await supabase
    .from('folders')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Ошибка обновления папки: ${error.message}`);
  }

  return data;
};

export const deleteFolder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Ошибка удаления папки: ${error.message}`);
  }
};

export const getFolderImages = async (folderId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from('folder_images')
    .select('image_id')
    .eq('folder_id', folderId);

  if (error) {
    throw new Error(`Ошибка загрузки изображений папки: ${error.message}`);
  }

  return data.map(item => item.image_id);
};

export const addImagesToFolder = async (folderId: string, imageIds: string[]): Promise<void> => {
  const folderImages = imageIds.map(imageId => ({
    folder_id: folderId,
    image_id: imageId
  }));

  const { error } = await supabase
    .from('folder_images')
    .upsert(folderImages, { onConflict: 'folder_id,image_id' });

  if (error) {
    throw new Error(`Ошибка добавления изображений в папку: ${error.message}`);
  }
};

export const removeImagesFromFolder = async (folderId: string, imageIds: string[]): Promise<void> => {
  const { error } = await supabase
    .from('folder_images')
    .delete()
    .eq('folder_id', folderId)
    .in('image_id', imageIds);

  if (error) {
    throw new Error(`Ошибка удаления изображений из папки: ${error.message}`);
  }
};
