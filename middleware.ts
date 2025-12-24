import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/', '/auth', '/auth/reset-password'];

// Rutas que requieren rol de admin
const adminRoutes = ['/admin'];

// Rutas que requieren rol de cliente
const clientRoutes = ['/cliente'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si la ruta es pública
  if (publicRoutes.includes(pathname) || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // Obtener tokens de las cookies
  const accessToken = request.cookies.get('supabase-access-token')?.value;
  const refreshToken = request.cookies.get('supabase-refresh-token')?.value;
  
  if (!accessToken) {
    // No hay token, redirigir a auth (excepto para API que devuelve 401)
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'No autenticado' },
        { status: 401 }
      );
    }
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    // Validar token con Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      // Token inválido o expirado, intentar refresh
      if (refreshToken) {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });

        if (refreshError || !refreshData.session) {
          // Refresh falló, redirigir a auth
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { success: false, error: 'Sesión expirada' },
              { status: 401 }
            );
          }
          return NextResponse.redirect(new URL('/auth', request.url));
        }

        // Actualizar cookies con nuevos tokens
        const response = NextResponse.next();
        response.cookies.set('supabase-access-token', refreshData.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60,
        });
        response.cookies.set('supabase-refresh-token', refreshData.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7,
        });

        // Continuar con el usuario refrescado
        const refreshedUser = refreshData.user;
        if (!refreshedUser) {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { success: false, error: 'Sesión inválida' },
              { status: 401 }
            );
          }
          return NextResponse.redirect(new URL('/auth', request.url));
        }

        // Obtener rol del usuario de la tabla users
        const { data: userData } = await supabase
          .from('users')
          .select('rol')
          .eq('auth_id', refreshedUser.id)
          .single();

        if (!userData) {
          if (pathname.startsWith('/api/')) {
            return NextResponse.json(
              { success: false, error: 'Usuario no encontrado' },
              { status: 401 }
            );
          }
          return NextResponse.redirect(new URL('/auth', request.url));
        }

        // Verificar permisos de rol
        return checkRolePermissions(pathname, userData.rol, request.url, response);
      }

      // No hay refresh token, redirigir a auth
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'No autenticado' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Token válido, obtener rol del usuario
    const { data: userData } = await supabase
      .from('users')
      .select('rol')
      .eq('auth_id', user.id)
      .single();

    if (!userData) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado' },
          { status: 401 }
        );
      }
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    // Verificar permisos de rol
    return checkRolePermissions(pathname, userData.rol, request.url);
  } catch (error) {
    console.error('Error en middleware:', error);
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { success: false, error: 'Error de autenticación' },
        { status: 500 }
      );
    }
    return NextResponse.redirect(new URL('/auth', request.url));
  }
}

/**
 * Verificar permisos basados en rol
 */
function checkRolePermissions(
  pathname: string, 
  rol: string, 
  url: string,
  response?: NextResponse
): NextResponse {
  const res = response || NextResponse.next();

  // Verificar rutas de admin
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (rol !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Sin permisos' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/auth', url));
    }
  }

  // Verificar rutas de cliente
  if (clientRoutes.some(route => pathname.startsWith(route))) {
    if (rol !== 'cliente' && rol !== 'admin') {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Sin permisos' },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL('/auth', url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
