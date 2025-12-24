import { NextRequest, NextResponse } from 'next/server';
import { getAllMessages, createMessage, updateMessage, deleteMessage } from '@/app/actions/messages';
import { messageSchema } from '@/lib/validations';
import { log } from '@/lib/logger';

const API_VERSION = '1.0.0';

/**
 * GET /api/v1/messages - Obtener todos los mensajes
 */
export async function GET() {
  try {
    log.request('GET', '/api/v1/messages');
    
    const messages = await getAllMessages();
    
    log.response('GET', '/api/v1/messages', 200, { count: messages.length });
    
    return NextResponse.json(
      {
        success: true,
        data: messages,
        version: API_VERSION,
      },
      {
        status: 200,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al obtener mensajes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener mensajes',
        version: API_VERSION,
      },
      {
        status: 500,
        headers: { 'API-Version': API_VERSION },
      }
    );
  }
}

/**
 * POST /api/v1/messages - Crear un nuevo mensaje
 */
export async function POST(request: NextRequest) {
  try {
    log.request('POST', '/api/v1/messages');
    
    const body = await request.json();
    
    // Validar con Zod
    const validation = messageSchema.safeParse(body);
    
    if (!validation.success) {
      log.warn('Validación fallida en POST /api/v1/messages', { errors: validation.error.issues });
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.issues,
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    const message = await createMessage(validation.data);
    
    log.response('POST', '/api/v1/messages', 201, { id: message.id });
    
    return NextResponse.json(
      {
        success: true,
        data: message,
        version: API_VERSION,
      },
      {
        status: 201,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al crear mensaje:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear mensaje',
        version: API_VERSION,
      },
      {
        status: 500,
        headers: { 'API-Version': API_VERSION },
      }
    );
  }
}

/**
 * PUT /api/v1/messages - Actualizar un mensaje existente
 */
export async function PUT(request: NextRequest) {
  try {
    log.request('PUT', '/api/v1/messages');
    
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de mensaje requerido',
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    // Validar datos con Zod (parcial)
    const validation = messageSchema.partial().safeParse(data);
    
    if (!validation.success) {
      log.warn('Validación fallida en PUT /api/v1/messages', { errors: validation.error.issues });
      return NextResponse.json(
        {
          success: false,
          error: 'Datos inválidos',
          details: validation.error.issues,
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    const message = await updateMessage(id, validation.data);
    
    log.response('PUT', '/api/v1/messages', 200, { id });
    
    return NextResponse.json(
      {
        success: true,
        data: message,
        version: API_VERSION,
      },
      {
        status: 200,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al actualizar mensaje:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar mensaje',
        version: API_VERSION,
      },
      {
        status: 500,
        headers: { 'API-Version': API_VERSION },
      }
    );
  }
}

/**
 * DELETE /api/v1/messages - Eliminar un mensaje
 */
export async function DELETE(request: NextRequest) {
  try {
    log.request('DELETE', '/api/v1/messages');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de mensaje requerido',
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    // Validar que sea UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de mensaje inválido (debe ser UUID)',
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    await deleteMessage(id);
    
    log.response('DELETE', '/api/v1/messages', 200, { id });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje eliminado correctamente',
        version: API_VERSION,
      },
      {
        status: 200,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al eliminar mensaje:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar mensaje',
        version: API_VERSION,
      },
      {
        status: 500,
        headers: { 'API-Version': API_VERSION },
      }
    );
  }
}
