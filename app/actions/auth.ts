"use server";

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// Cliente de Supabase para server actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    nombre_completo?: string;
    rol: 'admin' | 'cliente';
    cliente_id?: string;
  };
}

/**
 * Registrar un nuevo usuario con Supabase Auth
 */
export async function signUp(data: {
  email: string;
  password: string;
  username: string;
  nombre_completo: string;
  rol?: 'admin' | 'cliente';
  cliente_id?: string;
}): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          nombre_completo: data.nombre_completo,
          rol: data.rol || 'cliente',
          cliente_id: data.cliente_id,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: 'No se pudo crear el usuario' };
    }

    // Obtener datos completos del usuario de la tabla public.users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !userData) {
      // El trigger debería haber creado el usuario, si no existe hay un problema
      return { 
        success: false, 
        error: 'Usuario creado pero no sincronizado. Intenta iniciar sesión.' 
      };
    }

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        nombre_completo: userData.nombre_completo,
        rol: userData.rol as 'admin' | 'cliente',
        cliente_id: userData.cliente_id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al registrar usuario',
    };
  }
}

/**
 * Iniciar sesión con email y contraseña
 */
export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return { success: false, error: 'Email o contraseña incorrectos' };
    }

    if (!authData.user) {
      return { success: false, error: 'No se pudo iniciar sesión' };
    }

    // Obtener datos completos del usuario
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !userData) {
      return { success: false, error: 'Usuario no encontrado en la base de datos' };
    }

    // Guardar tokens en cookies (httpOnly, secure)
    const cookieStore = await cookies();
    cookieStore.set('supabase-access-token', authData.session?.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hora
    });
    cookieStore.set('supabase-refresh-token', authData.session?.refresh_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        nombre_completo: userData.nombre_completo,
        rol: userData.rol as 'admin' | 'cliente',
        cliente_id: userData.cliente_id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al iniciar sesión',
    };
  }
}

/**
 * Cerrar sesión
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, error: error.message };
    }

    // Limpiar cookies
    const cookieStore = await cookies();
    cookieStore.delete('supabase-access-token');
    cookieStore.delete('supabase-refresh-token');
    
    revalidatePath('/', 'layout');
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cerrar sesión',
    };
  }
}

/**
 * Obtener la sesión actual del usuario
 */
export async function getSession(): Promise<AuthResponse> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('supabase-access-token')?.value;
    const refreshToken = cookieStore.get('supabase-refresh-token')?.value;

    if (!accessToken) {
      return { success: false, error: 'No hay sesión activa' };
    }

    // Validar el token con Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      // Token inválido o expirado, intentar refresh
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

        if (refreshError || !refreshData.session) {
          // Refresh falló, sesión expirada
          return { success: false, error: 'Sesión expirada' };
        }

        // Actualizar cookies con nuevos tokens
        cookieStore.set('supabase-access-token', refreshData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60,
        });
        cookieStore.set('supabase-refresh-token', refreshData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        // Usar el usuario del refresh
        const refreshedUser = refreshData.user;
        if (!refreshedUser) {
          return { success: false, error: 'No se pudo refrescar la sesión' };
        }

        // Obtener datos del usuario
        const { data: userData, error: userDataError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', refreshedUser.id)
          .single();

        if (userDataError || !userData) {
          return { success: false, error: 'Usuario no encontrado' };
        }

        return {
          success: true,
          user: {
            id: userData.id,
            email: userData.email,
            username: userData.username,
            nombre_completo: userData.nombre_completo,
            rol: userData.rol as 'admin' | 'cliente',
            cliente_id: userData.cliente_id,
          },
        };
      }

      return { success: false, error: 'Sesión expirada' };
    }

    // Token válido, obtener datos del usuario
    const { data: userData, error: userDataError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (userDataError || !userData) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        nombre_completo: userData.nombre_completo,
        rol: userData.rol as 'admin' | 'cliente',
        cliente_id: userData.cliente_id,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al obtener sesión',
    };
  }
}

/**
 * Cambiar contraseña del usuario actual
 */
export async function changePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();
    
    if (!session.success) {
      return { success: false, error: 'No hay sesión activa' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al cambiar contraseña',
    };
  }
}

/**
 * Solicitar reset de contraseña (envía email)
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al solicitar reset',
    };
  }
}
