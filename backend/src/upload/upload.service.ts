import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { CreateFileDTO } from './create_file.dto';

@Injectable()
export class UploadService {
  async upload(file: CreateFileDTO) {
    const supabaseUrl = 'https://yypotyrjhcyfoglxmxdz.supabase.co';
    const supabaseKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cG90eXJqaGN5Zm9nbHhteGR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTgyODk3NSwiZXhwIjoyMDQ1NDA0OTc1fQ.3shtn1xp1rKgq80sgiRnsFK8ke3zfoc8zfNLFoE7rtU';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false
      }
    });

    await supabase.storage
      .from('DrinkHub')
      .upload(file.originalname, file.buffer, {
        upsert: false
      });

    const { data: publicData } = supabase.storage
      .from('DrinkHub')
      .getPublicUrl(file.originalname);

    return publicData.publicUrl;
  }
}
