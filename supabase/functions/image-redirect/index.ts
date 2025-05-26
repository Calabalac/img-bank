
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: string
          filename: string
          original_name: string
          file_path: string
          file_size: number | null
          mime_type: string | null
          short_url: string
          uploaded_at: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const filename = url.pathname.split('/').pop()

    if (!filename) {
      return new Response('Filename not provided', { 
        status: 400,
        headers: corsHeaders
      })
    }

    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Ищем изображение по имени файла
    const { data: image, error } = await supabaseClient
      .from('images')
      .select('*')
      .eq('filename', filename)
      .maybeSingle()

    if (error || !image) {
      return new Response('Image not found', { 
        status: 404,
        headers: corsHeaders
      })
    }

    // Получаем публичную ссылку на файл
    const { data: urlData } = supabaseClient.storage
      .from('images')
      .getPublicUrl(image.filename)

    if (!urlData.publicUrl) {
      return new Response('Failed to get image URL', { 
        status: 500,
        headers: corsHeaders
      })
    }

    // Перенаправляем на изображение
    return Response.redirect(urlData.publicUrl, 302)

  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal server error', { 
      status: 500,
      headers: corsHeaders
    })
  }
})
