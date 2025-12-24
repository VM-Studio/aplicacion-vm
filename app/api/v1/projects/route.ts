import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject, updateProject, deleteProject } from "@/app/actions/projects";
import { createProjectSchema, updateProjectSchema } from "@/lib/validations";
import { log } from "@/lib/logger";
import { z } from "zod";

// Header de versionado de API
const API_VERSION = "1.0.0";

function addApiHeaders(response: NextResponse) {
  response.headers.set("API-Version", API_VERSION);
  response.headers.set("Content-Type", "application/json");
  return response;
}

// GET /api/v1/projects
export async function GET() {
  try {
    log.info("GET /api/v1/projects - Fetching all projects");
    
    const projects = await getProjects();
    
    const response = NextResponse.json({
      success: true,
      data: projects,
      version: API_VERSION,
    });
    
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error fetching projects", error);
    
    const response = NextResponse.json(
      {
        success: false,
        error: "Error al obtener proyectos",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
    
    return addApiHeaders(response);
  }
}

// POST /api/v1/projects
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    log.info("POST /api/v1/projects - Creating project", { body });
    
    // Validar con Zod
    const validationResult = createProjectSchema.safeParse(body);
    
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
    
    const project = await createProject(validationResult.data);
    
    log.info("Project created successfully", { id: project.id });
    
    const response = NextResponse.json(
      {
        success: true,
        data: project,
        version: API_VERSION,
      },
      { status: 201 }
    );
    
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error creating project", error);
    
    const response = NextResponse.json(
      {
        success: false,
        error: "Error al crear proyecto",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
    
    return addApiHeaders(response);
  }
}

// PUT /api/v1/projects
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    log.info("PUT /api/v1/projects - Updating project", { body });
    
    // Extraer ID
    const { id, ...updates } = body;
    
    if (!id) {
      const response = NextResponse.json(
        {
          success: false,
          error: "ID de proyecto requerido",
        },
        { status: 400 }
      );
      
      return addApiHeaders(response);
    }
    
    // Validar actualizaciones
    const validationResult = updateProjectSchema.safeParse(updates);
    
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
    
    const project = await updateProject(id, validationResult.data);
    
    log.info("Project updated successfully", { id });
    
    const response = NextResponse.json({
      success: true,
      data: project,
      version: API_VERSION,
    });
    
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error updating project", error);
    
    const response = NextResponse.json(
      {
        success: false,
        error: "Error al actualizar proyecto",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
    
    return addApiHeaders(response);
  }
}

// DELETE /api/v1/projects?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    log.info("DELETE /api/v1/projects - Deleting project", { id });
    
    if (!id) {
      const response = NextResponse.json(
        {
          success: false,
          error: "ID de proyecto requerido",
        },
        { status: 400 }
      );
      
      return addApiHeaders(response);
    }
    
    // Validar UUID
    const uuidSchema = z.string().uuid();
    const validationResult = uuidSchema.safeParse(id);
    
    if (!validationResult.success) {
      const response = NextResponse.json(
        {
          success: false,
          error: "ID inválido",
        },
        { status: 400 }
      );
      
      return addApiHeaders(response);
    }
    
    await deleteProject(id);
    
    log.info("Project deleted successfully", { id });
    
    const response = NextResponse.json({
      success: true,
      message: "Proyecto eliminado correctamente",
      version: API_VERSION,
    });
    
    return addApiHeaders(response);
  } catch (error) {
    log.error("Error deleting project", error);
    
    const response = NextResponse.json(
      {
        success: false,
        error: "Error al eliminar proyecto",
        message: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
    
    return addApiHeaders(response);
  }
}
