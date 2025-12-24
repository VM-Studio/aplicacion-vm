import { NextRequest, NextResponse } from "next/server";
import { getClients, createClient, updateClient, deleteClient } from "@/app/actions/clients";
import { clientSchema } from "@/lib/validations";
import { log } from "@/lib/logger";
import { z } from "zod";

const API_VERSION = "1.0.0";

function addApiHeaders(response: NextResponse) {
  response.headers.set("API-Version", API_VERSION);
  response.headers.set("Content-Type", "application/json");
  return response;
}

// GET /api/v1/clients
export async function GET() {
  try {
    log.info("GET /api/v1/clients - Fetching all clients");
    const clients = await getClients();
    
    const response = NextResponse.json({
      success: true,
      data: clients,
      version: API_VERSION,
    });
    
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error fetching clients", error);
    const response = NextResponse.json(
      { success: false, error: "Error al obtener clientes" },
      { status: 500 }
    );
    return addApiHeaders(response);
  }
}

// POST /api/v1/clients
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    log.info("POST /api/v1/clients - Creating client", { body });
    
    const validationResult = clientSchema.safeParse(body);
    
    if (!validationResult.success) {
      log.warn("Validation failed", validationResult.error);
      const response = NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
      return addApiHeaders(response);
    }
    
    const client = await createClient(validationResult.data);
    log.info("Client created successfully", { id: client.id });
    
    const response = NextResponse.json(
      { success: true, data: client, version: API_VERSION },
      { status: 201 }
    );
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error creating client", error);
    const response = NextResponse.json(
      { success: false, error: "Error al crear cliente" },
      { status: 500 }
    );
    return addApiHeaders(response);
  }
}

// PUT /api/v1/clients
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      const response = NextResponse.json(
        { success: false, error: "ID de cliente requerido" },
        { status: 400 }
      );
      return addApiHeaders(response);
    }
    
    const validationResult = clientSchema.partial().safeParse(updates);
    
    if (!validationResult.success) {
      const response = NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
      return addApiHeaders(response);
    }
    
    const client = await updateClient(id, validationResult.data);
    const response = NextResponse.json({
      success: true,
      data: client,
      version: API_VERSION,
    });
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error updating client", error);
    const response = NextResponse.json(
      { success: false, error: "Error al actualizar cliente" },
      { status: 500 }
    );
    return addApiHeaders(response);
  }
}

// DELETE /api/v1/clients?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      const response = NextResponse.json(
        { success: false, error: "ID de cliente requerido" },
        { status: 400 }
      );
      return addApiHeaders(response);
    }
    
    const uuidSchema = z.string().uuid();
    if (!uuidSchema.safeParse(id).success) {
      const response = NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      );
      return addApiHeaders(response);
    }
    
    await deleteClient(id);
    const response = NextResponse.json({
      success: true,
      message: "Cliente eliminado correctamente",
      version: API_VERSION,
    });
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error deleting client", error);
    const response = NextResponse.json(
      { success: false, error: "Error al eliminar cliente" },
      { status: 500 }
    );
    return addApiHeaders(response);
  }
}
