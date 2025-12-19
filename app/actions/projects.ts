"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("id, nombre, descripcion, fecha_estimada, avance, checklists, url_proyecto, codigo")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProject(projectData: any) {
  const { data, error } = await supabase
    .from("projects")
    .insert([projectData])
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  return data;
}

export async function updateProject(id: string, updates: any) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  return data;
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  revalidatePath("/admin");
  return { success: true };
}
