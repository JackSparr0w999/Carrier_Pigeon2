import { supabase } from '../supabase/config';

// Upload file
export const uploadFile = async (file, sessionId) => {
  // Upload file a Supabase Storage
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('transfers')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Ottieni URL pubblico
  const { data: { publicUrl } } = supabase.storage
    .from('transfers')
    .getPublicUrl(fileName);

  // Salva metadati nel database
  const { data, error } = await supabase
    .from('transfers')
    .insert([{
      session_id: sessionId,
      file_name: file.name,
      file_size: file.size,
      file_url: publicUrl,
      device_name: navigator.platform,
      file_type: file.type.startsWith('image/') ? 'photo' : 'document'
    }]);

  if (error) throw error;
  return { publicUrl, sessionId };
};

// Cerca trasferimenti
export const getTransfers = async (sessionId) => {
  const { data, error } = await supabase
    .from('transfers')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};