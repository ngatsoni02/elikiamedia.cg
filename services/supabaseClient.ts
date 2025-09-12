import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://bnjfxltjqaaohrqjtmsx.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuamZ4bHRqcWFhb2hycWp0bXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NjU3MDgsImV4cCI6MjA3MzI0MTcwOH0.ilezKn8FCa5mjrDGckgLDSgHQyzI1xwGPxZwaGQOKLk';

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMessage = "Erreur de configuration Supabase : l'URL (VITE_SUPABASE_URL) ou la clé Anon (VITE_SUPABASE_ANON_KEY) est manquante.";
  alert(errorMessage);
  console.error(errorMessage);
  throw new Error(errorMessage);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
