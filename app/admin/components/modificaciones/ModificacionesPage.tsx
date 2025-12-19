"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiCheck, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

interface Modificacion {
  id: string;
  proyecto_id: string;
  texto: string;
  fecha: string;
  estado: "Pendiente" | "En proceso" | "Completada";
}

interface Project {
  id: string;
  nombre: string;
  cliente_id: string;
}

interface ModificacionesPageProps {
  projects: Project[];
}

export default function ModificacionesPage({ projects }: ModificacionesPageProps) {
  const [modificaciones, setModificaciones] = useState<Modificacion[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<"Todas" | "Pendiente" | "En proceso" | "Completada">("Todas");
  const [filtroProyecto, setFiltroProyecto] = useState<string>("Todos");
  const [loading, setLoading] = useState(true);

  // Cargar modificaciones
  const cargarModificaciones = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("modificaciones")
      .select("*")
      .order("fecha", { ascending: false });

    if (data) {
      setModificaciones(data as Modificacion[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      await cargarModificaciones();
    };
    fetchData();
  }, []);

  // Marcar como completada
  async function marcarComoCompletada(id: string) {
    const { error } = await supabase
      .from("modificaciones")
      .update({ estado: "Completada" })
      .eq("id", id);

    if (!error) {
      cargarModificaciones();
    }
  }

  // Cambiar estado
  async function cambiarEstado(id: string, nuevoEstado: "Pendiente" | "En proceso" | "Completada") {
    const { error } = await supabase
      .from("modificaciones")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (!error) {
      cargarModificaciones();
    }
  }

  // Filtrar modificaciones
  const modificacionesFiltradas = modificaciones.filter((m) => {
    const cumpleFiltroEstado = filtroEstado === "Todas" || m.estado === filtroEstado;
    const cumpleFiltroProyecto = filtroProyecto === "Todos" || m.proyecto_id === filtroProyecto;
    return cumpleFiltroEstado && cumpleFiltroProyecto;
  });

  // Agrupar por proyecto
  const modificacionesPorProyecto = modificacionesFiltradas.reduce((acc, mod) => {
    if (!acc[mod.proyecto_id]) {
      acc[mod.proyecto_id] = [];
    }
    acc[mod.proyecto_id].push(mod);
    return acc;
  }, {} as Record<string, Modificacion[]>);

  // Obtener nombre del proyecto
  const getNombreProyecto = (proyectoId: string) => {
    const proyecto = projects.find(p => p.id === proyectoId);
    return proyecto?.nombre || "Proyecto Desconocido";
  };

  // Estadísticas
  const totalModificaciones = modificaciones.length;
  const pendientes = modificaciones.filter(m => m.estado === "Pendiente").length;
  const enProceso = modificaciones.filter(m => m.estado === "En proceso").length;
  const completadas = modificaciones.filter(m => m.estado === "Completada").length;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Header con estadísticas */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#111", margin: 0, marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
          Solicitudes de Modificación
        </h1>
        <p style={{ fontSize: 15, color: "#666", margin: 0 }}>
          Gestiona las solicitudes de cambios de los clientes
        </p>
      </div>

      {/* Estadísticas cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        <div
          style={{
            background: "rgba(0, 0, 0, 0.02)",
            borderRadius: 12,
            padding: "20px 24px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(0, 0, 0, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiAlertCircle size={20} color="#666" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>Total</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
                {totalModificaciones}
              </div>
            </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(0, 0, 0, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiClock size={20} color="#666" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>Pendientes</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
                {pendientes}
              </div>
            </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(0, 0, 0, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiClock size={20} color="#666" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>En Proceso</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
                {enProceso}
              </div>
            </div>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(0, 0, 0, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiCheckCircle size={20} color="#666" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>Completadas</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
                {completadas}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
          border: "1px solid #e6eaf0",
          marginBottom: 24,
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#666", display: "block", marginBottom: 8 }}>
            Filtrar por estado
          </label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as "Todas" | "Pendiente" | "En proceso" | "Completada")}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e6eaf0",
              fontSize: 14,
              color: "#111",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="Todas">Todas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En proceso">En Proceso</option>
            <option value="Completada">Completadas</option>
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#666", display: "block", marginBottom: 8 }}>
            Filtrar por proyecto
          </label>
          <select
            value={filtroProyecto}
            onChange={(e) => setFiltroProyecto(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e6eaf0",
              fontSize: 14,
              color: "#111",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <option value="Todos">Todos los proyectos</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de modificaciones por proyecto */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "#666" }}>
          Cargando modificaciones...
        </div>
      ) : modificacionesFiltradas.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 60,
            border: "1px solid #e6eaf0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(0, 73, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <FiCheckCircle size={36} color="rgba(0, 73, 255, 0.4)" strokeWidth={2} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, color: "#111", margin: 0, marginBottom: 6 }}>
            No hay modificaciones
          </p>
          <p style={{ fontSize: 14, color: "#666", margin: 0 }}>
            Las solicitudes de los clientes aparecerán aquí
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {Object.entries(modificacionesPorProyecto).map(([proyectoId, mods]) => (
            <div
              key={proyectoId}
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #e6eaf0",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Header del proyecto */}
              <div
                style={{
                  background: "rgba(0, 73, 255, 0.04)",
                  padding: "16px 24px",
                  borderBottom: "1px solid #e6eaf0",
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: 0, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
                  {getNombreProyecto(proyectoId)}
                </h3>
                <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>
                  {mods.length} {mods.length === 1 ? "solicitud" : "solicitudes"}
                </p>
              </div>

              {/* Lista de modificaciones estilo chat */}
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {mods.map((mod) => (
                  <div
                    key={mod.id}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: 20,
                      background: mod.estado === "Completada" ? "#f8fafb" : "#fff",
                      borderRadius: 12,
                      border: mod.estado === "Completada" 
                        ? "1px solid rgba(16, 185, 129, 0.2)" 
                        : "1px solid #e6eaf0",
                      position: "relative",
                      textDecoration: mod.estado === "Completada" ? "line-through" : "none",
                      opacity: mod.estado === "Completada" ? 0.7 : 1,
                    }}
                  >
                    {/* Avatar/Icono del cliente */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0049ff 0%, #0066ff 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      C
                    </div>

                    {/* Contenido de la modificación */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 4 }}>
                            Cliente
                          </div>
                          <div style={{ fontSize: 12, color: "#999" }}>
                            {new Date(mod.fecha).toLocaleString("es-AR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>

                        {/* Badge de estado */}
                        <div
                          style={{
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 600,
                            background:
                              mod.estado === "Completada"
                                ? "rgba(16, 185, 129, 0.1)"
                                : mod.estado === "En proceso"
                                ? "rgba(0, 73, 255, 0.1)"
                                : "rgba(255, 179, 0, 0.1)",
                            color:
                              mod.estado === "Completada"
                                ? "#10b981"
                                : mod.estado === "En proceso"
                                ? "#0049ff"
                                : "#ffb300",
                            border:
                              mod.estado === "Completada"
                                ? "1px solid rgba(16, 185, 129, 0.2)"
                                : mod.estado === "En proceso"
                                ? "1px solid rgba(0, 73, 255, 0.2)"
                                : "1px solid rgba(255, 179, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            height: "fit-content",
                          }}
                        >
                          {mod.estado === "Completada" && <FiCheckCircle size={14} />}
                          {mod.estado === "En proceso" && <FiClock size={14} />}
                          {mod.estado === "Pendiente" && <FiAlertCircle size={14} />}
                          {mod.estado}
                        </div>
                      </div>

                      {/* Texto de la solicitud */}
                      <p style={{ fontSize: 15, color: "#111", lineHeight: 1.6, margin: "0 0 16px" }}>
                        {mod.texto}
                      </p>

                      {/* Botones de acción */}
                      {mod.estado !== "Completada" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          {mod.estado === "Pendiente" && (
                            <button
                              onClick={() => cambiarEstado(mod.id, "En proceso")}
                              style={{
                                background: "rgba(0, 73, 255, 0.1)",
                                color: "#0049ff",
                                border: "1px solid rgba(0, 73, 255, 0.2)",
                                borderRadius: 8,
                                padding: "8px 16px",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "rgba(0, 73, 255, 0.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "rgba(0, 73, 255, 0.1)";
                              }}
                            >
                              <FiClock size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                              Marcar en proceso
                            </button>
                          )}
                          <button
                            onClick={() => marcarComoCompletada(mod.id)}
                            style={{
                              background: "rgba(16, 185, 129, 0.1)",
                              color: "#10b981",
                              border: "1px solid rgba(16, 185, 129, 0.2)",
                              borderRadius: 8,
                              padding: "8px 16px",
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: "pointer",
                              transition: "all 0.2s",
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "rgba(16, 185, 129, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(16, 185, 129, 0.1)";
                            }}
                          >
                            <FiCheck size={14} strokeWidth={3} />
                            Marcar como completada
                          </button>
                        </div>
                      )}

                      {/* Tick de completado */}
                      {mod.estado === "Completada" && (
                        <div
                          style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <FiCheck size={18} color="#fff" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
