import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateUniqueFilename = (originalName: string) => {
  // Clean the original name: remove unsafe characters and keep only the name and extension
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  
  // Split name and extension
  const lastDotIndex = cleanName.lastIndexOf('.');
  if (lastDotIndex === -1) {
    // No extension, add png as default
    return `${timestamp}_${randomStr}_${cleanName}.png`;
  }
  
  const nameWithoutExt = cleanName.substring(0, lastDotIndex);
  const extension = cleanName.substring(lastDotIndex);
  
  return `${timestamp}_${randomStr}_${nameWithoutExt}${extension}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    if (!imageUrl) {
      throw new Error('imageUrl is required')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }
    const blob = await response.blob()
    const mimeType = response.headers.get('content-type') || 'application/octet-stream'
    
    const originalName = imageUrl.split('/').pop()?.split('?')[0] || 'image.png'
    const filename = generateUniqueFilename(originalName)

    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(filename, blob, { contentType: mimeType })

    if (uploadError) {
      throw uploadError
    }
    
    return new Response(
      JSON.stringify({ 
        filename,
        original_name: originalName,
        file_size: blob.size,
        mime_type: mimeType
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
