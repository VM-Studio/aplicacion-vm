"use server";

import { supabase } from "@/lib/supabaseClient";
import { revalidatePath } from "next/cache";

export async function getPayments(projectId?: string) {
  let query = supabase.from("pagos").select("*");
  
  if (projectId) {
    query = query.eq("proyecto_id", projectId);
  }
  
  const { data, error } = await query.order("fecha_pago", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createPayment(paymentData: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("pagos")
    .insert([paymentData])
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return data;
}

export async function updatePayment(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("pagos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return data;
}

export async function deletePayment(id: string) {
  const { error } = await supabase
    .from("pagos")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  revalidatePath("/admin");
  revalidatePath("/cliente");
  return { success: true };
}
