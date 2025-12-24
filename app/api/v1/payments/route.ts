import { NextRequest, NextResponse } from 'next/server';
import { getPayments, createPayment, updatePayment, deletePayment } from '@/app/actions/payments';
import { paymentSchema } from '@/lib/validations';
import { log } from '@/lib/logger';

const API_VERSION = '1.0.0';

/**
 * GET /api/v1/payments - Obtener todos los pagos
 */
export async function GET() {
  try {
    log.request('GET', '/api/v1/payments');
    
    const payments = await getPayments();
    
    log.response('GET', '/api/v1/payments', 200, { count: payments.length });
    
    return NextResponse.json(
      {
        success: true,
        data: payments,
        version: API_VERSION,
      },
      {
        status: 200,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al obtener pagos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener pagos',
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
 * POST /api/v1/payments - Crear un nuevo pago
 */
export async function POST(request: NextRequest) {
  try {
    log.request('POST', '/api/v1/payments');
    
    const body = await request.json();
    
    // Validar con Zod
    const validation = paymentSchema.safeParse(body);
    
    if (!validation.success) {
      log.warn('Validación fallida en POST /api/v1/payments', { errors: validation.error.issues });
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
    
    const payment = await createPayment(validation.data);
    
    log.response('POST', '/api/v1/payments', 201, { id: payment.id });
    
    return NextResponse.json(
      {
        success: true,
        data: payment,
        version: API_VERSION,
      },
      {
        status: 201,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al crear pago:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear pago',
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
 * PUT /api/v1/payments - Actualizar un pago existente
 */
export async function PUT(request: NextRequest) {
  try {
    log.request('PUT', '/api/v1/payments');
    
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de pago requerido',
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    // Validar datos con Zod (parcial)
    const validation = paymentSchema.partial().safeParse(data);
    
    if (!validation.success) {
      log.warn('Validación fallida en PUT /api/v1/payments', { errors: validation.error.issues });
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
    
    const payment = await updatePayment(id, validation.data);
    
    log.response('PUT', '/api/v1/payments', 200, { id });
    
    return NextResponse.json(
      {
        success: true,
        data: payment,
        version: API_VERSION,
      },
      {
        status: 200,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al actualizar pago:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar pago',
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
 * DELETE /api/v1/payments - Eliminar un pago
 */
export async function DELETE(request: NextRequest) {
  try {
    log.request('DELETE', '/api/v1/payments');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'ID de pago requerido',
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
          error: 'ID de pago inválido (debe ser UUID)',
          version: API_VERSION,
        },
        {
          status: 400,
          headers: { 'API-Version': API_VERSION },
        }
      );
    }
    
    await deletePayment(id);
    
    log.response('DELETE', '/api/v1/payments', 200, { id });
    
    return NextResponse.json(
      {
        success: true,
        message: 'Pago eliminado correctamente',
        version: API_VERSION,
      },
      {
        status: 200,
        headers: { 'API-Version': API_VERSION },
      }
    );
  } catch (error) {
    log.error('Error al eliminar pago:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar pago',
        version: API_VERSION,
      },
      {
        status: 500,
        headers: { 'API-Version': API_VERSION },
      }
    );
  }
}
