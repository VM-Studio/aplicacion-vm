"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function getClients() {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createClient(clientData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("clients")
    .insert([clientData])
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  return data;
}

export async function updateClient(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  revalidatePath("/admin");
  return { success: true };
}
