import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqbvpkyupptqpkoefebq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxYnZwa3l1cHB0cXBrb2VmZWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjkxMTYsImV4cCI6MjA5NzkwNTExNn0.toArP_TftiMTVagmMId1B8Aumm5_Efguu94YRlX9SRg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUpWithPassword = async (email: string, password: string) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signInWithPassword = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const logout = async () => {
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
