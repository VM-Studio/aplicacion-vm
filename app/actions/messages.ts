"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function getMessages(projectId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("timestamp", { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function getAllMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("timestamp", { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function createMessage(messageData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("messages")
    .insert([messageData])
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return data;
}

export async function markMessagesAsRead(messageIds: string[]) {
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .in("id", messageIds);
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return { success: true };
}

export async function getUnreadCount(projectId: string, sender: "client" | "admin") {
  const { data, error } = await supabase
    .from("messages")
    .select("id", { count: "exact" })
    .eq("project_id", projectId)
    .eq("sender", sender)
    .eq("read", false);
  
  if (error) throw error;
  return data?.length || 0;
}

export async function updateMessage(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("messages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return data;
}

export async function deleteMessage(id: string) {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return { success: true };
}
