"use client";
import React, { useState } from "react";
import { Project, Client } from "../../types";
import { FiCalendar, FiUser, FiCheckCircle, FiClock, FiAlertCircle, FiTrash2, FiGrid, FiList } from "react-icons/fi";

interface ProjectsPageProps {
  projects: Project[];
  clients: Client[];
  onSelectProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export default function ProjectsPage({ projects, clients, onSelectProject, onDeleteProject }: ProjectsPageProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Función para obtener el nombre del cliente
  const getClientName = (clienteId: string) => {
    const client = clients.find((c) => c.id === clienteId);
    return client?.nombre || "Sin cliente";
  };

  // Función para obtener el color según el estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "completado":
        return "#2ecc40";
      case "en_progreso":
        return "#0049ff";
      case "pendiente":
        return "#ffb300";
      case "cancelado":
        return "#ff3b3b";
      default:
        return "#888";
    }
  };

  // Función para obtener el icono según el estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "completado":
        return <FiCheckCircle size={18} />;
      case "en_progreso":
        return <FiClock size={18} />;
      case "pendiente":
        return <FiAlertCircle size={18} />;
      case "cancelado":
        return <FiAlertCircle size={18} />;
      default:
        return <FiClock size={18} />;
    }
  };

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={{ padding: "0 32px 32px 32px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
            Proyectos
          </h1>
          <p style={{ fontSize: 16, color: "#666" }}>
            {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"} en total
          </p>
        </div>
        
        {/* Botones de vista */}
        <div
          style={{
            display: "flex",
            background: "#f6f7fa",
            borderRadius: 10,
            padding: 4,
          }}
        >
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: "8px 16px",
              background: viewMode === "grid" ? "#fff" : "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
              boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            <FiGrid size={18} color={viewMode === "grid" ? "#0049ff" : "#666"} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: "8px 16px",
              background: viewMode === "list" ? "#fff" : "transparent",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              transition: "all 0.2s",
              boxShadow: viewMode === "list" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
            }}
          >
            <FiList size={18} color={viewMode === "list" ? "#0049ff" : "#666"} />
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            borderRadius: 12,
            padding: "20px 24px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
            Total Proyectos
          </div>
          <div style={{ color: "#111", fontSize: 28, fontWeight: 700 }}>{projects.length}</div>
        </div>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            borderRadius: 12,
            padding: "20px 24px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
            En Progreso
          </div>
          <div style={{ color: "#111", fontSize: 28, fontWeight: 700 }}>
            {projects.filter((p) => p.estado === "en_progreso" && (p.avance || 0) < 100).length}
          </div>
        </div>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            borderRadius: 12,
            padding: "20px 24px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
            Completados
          </div>
          <div style={{ color: "#111", fontSize: 28, fontWeight: 700 }}>
            {projects.filter((p) => p.estado === "completado" || (p.avance || 0) === 100).length}
          </div>
        </div>

        <div
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            borderRadius: 12,
            padding: "20px 24px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ color: "#666", fontSize: 14, marginBottom: 8, fontWeight: 500 }}>
            Pendientes
          </div>
          <div style={{ color: "#111", fontSize: 28, fontWeight: 700 }}>
            {projects.filter((p) => p.estado === "pendiente").length}
          </div>
        </div>
      </div>

      {/* Lista de Proyectos */}
      {projects.length === 0 ? (
        <div
          style={{
            background: "#f6f7fa",
            borderRadius: 12,
            padding: 60,
            textAlign: "center",
            border: "2px dashed #e6eaf0",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ color: "#111", fontSize: 20, fontWeight: 600, marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
            No hay proyectos aún
          </h3>
          <p style={{ color: "#666", fontSize: 16 }}>
            Crea tu primer proyecto usando el botón Nuevo Proyecto en la barra lateral.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: viewMode === "grid" ? "grid" : "flex",
            gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(350px, 1fr))" : undefined,
            flexDirection: viewMode === "list" ? "column" : undefined,
            gap: 24,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject && onSelectProject(project)}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 24,
                border: "1px solid #e6eaf0",
                cursor: onSelectProject ? "pointer" : "default",
                transition: "all 0.2s",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Header del proyecto */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#111",
                      margin: 0,
                      lineHeight: 1.3,
                      fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {project.nombre}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 20,
                        background: getEstadoColor(project.estado || "pendiente") + "15",
                        color: getEstadoColor(project.estado || "pendiente"),
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {getEstadoIcon(project.estado || "pendiente")}
                      <span>
                        {project.estado === "en_progreso"
                          ? "En Progreso"
                          : project.estado === "completado"
                          ? "Completado"
                          : project.estado === "pendiente"
                          ? "Pendiente"
                          : "Cancelado"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDeleteProject && window.confirm(`¿Estás seguro de eliminar el proyecto "${project.nombre}"?`)) {
                          onDeleteProject(project.id);
                        }
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 8,
                        cursor: "pointer",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <FiTrash2 size={18} color="#ef4444" />
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#0049ff",
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  #{project.codigo}
                </div>
              </div>

              {/* Descripción */}
              <p
                style={{
                  fontSize: 14,
                  color: "#666",
                  marginBottom: 16,
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.descripcion}
              </p>

              {/* Información del cliente y fecha */}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                    fontSize: 14,
                    color: "#444",
                  }}
                >
                  <FiUser size={16} color="#666" />
                  <span>{getClientName(project.cliente_id)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 14,
                    color: "#444",
                  }}
                >
                  <FiCalendar size={16} color="#666" />
                  <span>Entrega: {formatDate(project.fecha_estimada)}</span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>Avance</span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#111",
                    }}
                  >
                    {project.avance || 0}%
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    background: "#e6eaf0",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${project.avance || 0}%`,
                      height: "100%",
                      background: "#0049ff",
                      transition: "width 0.3s ease",
                      borderRadius: 10,
                    }}
                  />
                </div>
              </div>

              {/* Número de tareas */}
              {project.checklists && project.checklists.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 12px",
                    background: "#f6f7fa",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FiCheckCircle size={14} />
                  <span>
                    {project.checklists.filter((t) => t.checked).length} de{" "}
                    {project.checklists.length} tareas completadas
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
