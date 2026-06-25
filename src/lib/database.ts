import { supabase } from './supabase';
import { AboutUs, HomeConcept, Blueprint, Room, InspirationItem, AppSettings } from '../types';

// Session Management
export const createSession = async (userId: string, role: 'admin' | 'viewer') => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([{ user_id: userId, role }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getSession = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  if (error) throw error;
  return data;
};

// About Us Operations
export const getAboutUs = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  return data || null;
};

export const upsertAboutUs = async (sessionId: string, aboutUs: AboutUs) => {
  const { data: existing } = await supabase
    .from('about_us')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('about_us')
      .update({
        couple_introduction: aboutUs.coupleIntroduction,
        living_routines: aboutUs.livingRoutines,
        lifestyle_habits: aboutUs.lifestyleHabits,
        ideal_home_vibe: aboutUs.idealHomeVibe,
        updated_at: new Date(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('about_us')
      .insert([{
        session_id: sessionId,
        couple_introduction: aboutUs.coupleIntroduction,
        living_routines: aboutUs.livingRoutines,
        lifestyle_habits: aboutUs.lifestyleHabits,
        ideal_home_vibe: aboutUs.idealHomeVibe,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Home Concept Operations
export const getHomeConcept = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('home_concept')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  return data || null;
};

export const upsertHomeConcept = async (sessionId: string, concept: HomeConcept) => {
  const { data: existing } = await supabase
    .from('home_concept')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('home_concept')
      .update({
        design_vision: concept.designVision,
        mood_palette: concept.moodPalette,
        overall_references: concept.overallReferences,
        updated_at: new Date(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('home_concept')
      .insert([{
        session_id: sessionId,
        design_vision: concept.designVision,
        mood_palette: concept.moodPalette,
        overall_references: concept.overallReferences,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// Blueprint Operations
export const getBlueprint = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('blueprint')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  return data || null;
};

export const upsertBlueprint = async (sessionId: string, blueprint: Blueprint) => {
  const { data: existing } = await supabase
    .from('blueprint')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('blueprint')
      .update({
        file_name: blueprint.fileName,
        dimensional_notes: blueprint.dimensionalNotes,
        updated_at: new Date(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('blueprint')
      .insert([{
        session_id: sessionId,
        file_name: blueprint.fileName,
        file_size: blueprint.fileSize,
        dimensional_notes: blueprint.dimensionalNotes,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export const deleteBlueprint = async (sessionId: string) => {
  const { error } = await supabase
    .from('blueprint')
    .delete()
    .eq('session_id', sessionId);
  if (error) throw error;
};

// Rooms Operations
export const getRooms = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('session_id', sessionId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const getRoomById = async (roomId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single();
  if (error) throw error;
  return data;
};

export const createRoom = async (sessionId: string, room: Room) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([{
      session_id: sessionId,
      name: room.name,
      sort_order: room.sortOrder,
      must_haves: room.mustHaves,
      nice_to_haves: room.niceToHaves,
      things_to_avoid: room.thingsToAvoid,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateRoom = async (roomId: string, updates: Partial<Room>) => {
  const { data, error } = await supabase
    .from('rooms')
    .update({
      name: updates.name,
      must_haves: updates.mustHaves,
      nice_to_haves: updates.niceToHaves,
      things_to_avoid: updates.thingsToAvoid,
      sort_order: updates.sortOrder,
      updated_at: new Date(),
    })
    .eq('id', roomId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteRoom = async (roomId: string) => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);
  if (error) throw error;
};

// Inspiration Items Operations
export const getInspirationItems = async (roomId: string) => {
  const { data, error } = await supabase
    .from('inspiration_items')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const createInspirationItem = async (item: InspirationItem) => {
  const { data, error } = await supabase
    .from('inspiration_items')
    .insert([{
      room_id: item.roomId,
      type: item.type,
      photo_file_name: item.photoFileName,
      external_url: item.externalUrl,
      annotation: item.annotation,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteInspirationItem = async (itemId: string) => {
  const { error } = await supabase
    .from('inspiration_items')
    .delete()
    .eq('id', itemId);
  if (error) throw error;
};

// App Settings Operations
export const getAppSettings = async (sessionId: string) => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  return data || null;
};

export const upsertAppSettings = async (sessionId: string, settings: AppSettings) => {
  const { data: existing } = await supabase
    .from('app_settings')
    .select('id')
    .eq('session_id', sessionId)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({
        updated_at: new Date(),
      })
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('app_settings')
      .insert([{
        session_id: sessionId,
        admin_password_hash: settings.adminPassword,
        viewer_password_hash: settings.viewerPassword,
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

// File Upload Operations
export const uploadBlueprintFile = async (sessionId: string, file: File) => {
  const fileName = `blueprints/${sessionId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('blueprint-files')
    .upload(fileName, file);
  if (error) throw error;
  return { path: data.path, fileName: file.name };
};

export const uploadInspirationPhoto = async (roomId: string, file: File) => {
  const fileName = `inspiration/${roomId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('inspiration-photos')
    .upload(fileName, file);
  if (error) throw error;
  return { path: data.path, fileName: file.name };
};

export const uploadMoodBoard = async (roomId: string, file: File) => {
  const fileName = `mood-boards/${roomId}/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('mood-boards')
    .upload(fileName, file);
  if (error) throw error;
  return { path: data.path, fileName: file.name };
};

export const getPublicFileUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};
