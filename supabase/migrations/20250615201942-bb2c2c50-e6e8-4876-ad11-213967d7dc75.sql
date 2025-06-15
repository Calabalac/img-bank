
-- Используем существующий тип user_role из базы данных
-- Обновляем таблицу profiles, добавляя недостающие столбцы если их нет
DO $$
BEGIN
  -- Проверяем и добавляем столбец role если его нет
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'role' AND table_schema = 'public') THEN
    ALTER TABLE public.profiles ADD COLUMN role user_role DEFAULT 'user';
  END IF;
END $$;

-- Обновляем функцию для проверки роли (перезаписываем существующую)
CREATE OR REPLACE FUNCTION public.has_role(check_role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = check_role
  );
$$;

-- Обновляем триггер для создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$;

-- Создаем триггер если его еще нет
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Делаем webworker37@gmail.com админом
UPDATE public.profiles 
SET role = 'admin'::user_role 
WHERE email = 'webworker37@gmail.com';

-- Исправляем таблицу folder_images для правильной работы drag&drop
ALTER TABLE public.folder_images 
DROP CONSTRAINT IF EXISTS folder_images_unique;

ALTER TABLE public.folder_images 
ADD CONSTRAINT folder_images_unique UNIQUE (folder_id, image_id);

-- Добавляем RLS политики для folders если их нет
DROP POLICY IF EXISTS "Users can view their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can create folders" ON public.folders;
DROP POLICY IF EXISTS "Users can update their own folders" ON public.folders;
DROP POLICY IF EXISTS "Users can delete their own folders" ON public.folders;

ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own folders" ON public.folders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create folders" ON public.folders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON public.folders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON public.folders
  FOR DELETE USING (auth.uid() = user_id);

-- Добавляем RLS политики для folder_images
DROP POLICY IF EXISTS "Users can view folder images" ON public.folder_images;
DROP POLICY IF EXISTS "Users can manage folder images" ON public.folder_images;

ALTER TABLE public.folder_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view folder images" ON public.folder_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.folders 
      WHERE id = folder_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage folder images" ON public.folder_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.folders 
      WHERE id = folder_id AND user_id = auth.uid()
    )
  );
