"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiExternalLink, FiCalendar } from "react-icons/fi";

interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_estimada: string;
  avance: number;
  checklists: Task[];
  url_proyecto?: string;
  codigo?: string;
}

interface Task {
  nombre: string;
  descripcion: string;
  checked: boolean;
  asignado?: string;
}

interface Modificacion {
  id: string;
  proyecto_id: string;
  texto: string;
  fecha: string;
  estado: "Pendiente" | "En proceso" | "Completada";
}

export default function MiProyectoPage({ proyecto }: { proyecto: Project | null }) {
  const [modificacion, setModificacion] = useState("");
  const [modificacionesEnviadas, setModificacionesEnviadas] = useState<Modificacion[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar modificaciones
  useEffect(() => {
    if (proyecto) {
      supabase
        .from("modificaciones")
        .select("*")
        .eq("proyecto_id", proyecto.id)
        .order("fecha", { ascending: false })
        .then(({ data }) => {
          if (data) setModificacionesEnviadas(data as Modificacion[]);
        });
    }
  }, [proyecto]);

  async function handleEnviarModificacion(e: React.FormEvent) {
    e.preventDefault();
    if (modificacion.trim() && proyecto) {
      await supabase.from("modificaciones").insert([
        {
          proyecto_id: proyecto.id,
          texto: modificacion,
          fecha: new Date().toISOString(),
          estado: "Pendiente",
        },
      ]);
      setModificacion("");
      const { data } = await supabase
        .from("modificaciones")
        .select("*")
        .eq("proyecto_id", proyecto.id)
        .order("fecha", { ascending: false });
      if (data) setModificacionesEnviadas(data as Modificacion[]);
    }
  }

  return (
    <div style={{ maxWidth: isMobile ? "100%" : 1600 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : (proyecto?.url_proyecto ? "1fr 1.2fr" : "1fr"),
          gap: isMobile ? 16 : 24,
          alignItems: "start",
        }}
      >
        {/* Columna izquierda: Información del proyecto y Modificaciones */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Tarjeta de información del proyecto */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #e6eaf0",
            }}
          >
          <h2
            style={{
              color: "#111",
              fontWeight: 800,
              fontSize: 28,
              marginBottom: 12,
            }}
          >
            {proyecto?.nombre || "Cargando proyecto..."}
          </h2>
          <p style={{ color: "#666", fontSize: 15, marginBottom: 20, lineHeight: 1.6 }}>
            {proyecto?.descripcion || ""}
          </p>

          {/* Info card - Fecha */}
          <div
            style={{
              background: "#f6f7fa",
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 16,
              maxWidth: 320,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "#0049ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <FiCalendar size={24} />
            </div>
            <div>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                Fecha estimada
              </p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>
                {proyecto?.fecha_estimada
                  ? new Date(proyecto.fecha_estimada).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Sin definir"}
              </p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                Progreso general
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0049ff" }}>
                {proyecto?.avance || 0}%
              </span>
            </div>
            <div
              style={{
                background: "#e6eaf0",
                borderRadius: 8,
                height: 12,
                width: "100%",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(90deg, #0049ff 0%, #0066ff 100%)",
                  width: `${proyecto?.avance || 0}%`,
                  height: "100%",
                  borderRadius: 8,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
          </div>

          {/* Tarjeta de Modificaciones */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 32,
              border: "1px solid #e6eaf0",
            }}
          >
            <h2
              style={{
                color: "#111",
                fontWeight: 700,
                fontSize: 24,
                marginBottom: 8,
              }}
            >
              Solicitar Modificación
            </h2>
            <p style={{ color: "#666", fontSize: 15, marginBottom: 24 }}>
              ¿Necesitas cambios en tu proyecto? Describe la modificación que deseas y
              nuestro equipo la revisará.
            </p>
            <form
              onSubmit={handleEnviarModificacion}
              style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}
            >
              <textarea
                value={modificacion}
                onChange={(e) => setModificacion(e.target.value)}
                placeholder="Describe detalladamente la modificación que necesitas..."
                required
                style={{
                  width: "100%",
                  minHeight: 120,
                  borderRadius: 8,
                  border: "1px solid #e6eaf0",
                  padding: 16,
                  fontSize: 15,
                  color: "#111",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#0049ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 24px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                  alignSelf: "flex-end",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0041dd";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0049ff";
                }}
              >
                Enviar solicitud
              </button>
            </form>

            {modificacionesEnviadas.length > 0 && (
              <div>
                <h4
                  style={{
                    color: "#111",
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 16,
                  }}
                >
                  Tus solicitudes enviadas
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {modificacionesEnviadas.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        background: m.estado === "Completada" ? "#f0fdf4" : "#f6f7fa",
                        borderRadius: 12,
                        padding: 20,
                        border: m.estado === "Completada" 
                          ? "1px solid rgba(16, 185, 129, 0.3)" 
                          : "1px solid #e6eaf0",
                        position: "relative",
                        opacity: m.estado === "Completada" ? 0.8 : 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "#666",
                          }}
                        >
                          {m.fecha
                            ? new Date(m.fecha).toLocaleDateString("es-AR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                        <span
                          style={{
                            padding: "4px 12px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            background:
                              m.estado === "Completada"
                                ? "rgba(16, 185, 129, 0.15)"
                                : m.estado === "En proceso"
                                ? "rgba(0, 73, 255, 0.1)"
                                : "rgba(255, 179, 0, 0.1)",
                            color:
                              m.estado === "Completada"
                                ? "#10b981"
                                : m.estado === "En proceso"
                                ? "#0049ff"
                                : "#ffb300",
                            border:
                              m.estado === "Completada"
                                ? "1px solid rgba(16, 185, 129, 0.3)"
                                : m.estado === "En proceso"
                                ? "1px solid rgba(0, 73, 255, 0.2)"
                                : "1px solid rgba(255, 179, 0, 0.2)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          {m.estado === "Completada" && (
                            <FiExternalLink size={12} style={{ transform: "rotate(90deg)" }} />
                          )}
                          {m.estado}
                        </span>
                      </div>
                      <p 
                        style={{ 
                          fontSize: 15, 
                          color: m.estado === "Completada" ? "#10b981" : "#111", 
                          lineHeight: 1.5,
                          textDecoration: m.estado === "Completada" ? "line-through" : "none",
                          fontWeight: m.estado === "Completada" ? 500 : 400,
                        }}
                      >
                        {m.texto}
                      </p>

                      {/* Tick verde grande cuando está completada */}
                      {m.estado === "Completada" && (
                        <div
                          style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#10b981",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vista previa del proyecto - Columna derecha */}
        {proyecto?.url_proyecto && (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              border: "1px solid #e6eaf0",
              height: "fit-content",
              position: "sticky",
              top: 24,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#111",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#27c93f",
                  animation: "pulse 2s infinite",
                }} />
                Vista Previa en Vivo
              </h3>
              <a
                href={proyecto.url_proyecto}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#fff",
                  background: "#0049ff",
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: "8px 16px",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#0041dd";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#0049ff";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Abrir en nueva pestaña
                <FiExternalLink size={16} />
              </a>
            </div>
            
            {/* URL del proyecto */}
            <div style={{
              background: "#f6f7fa",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontSize: 13, color: "#666", fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace" }}>
                {proyecto.url_proyecto}
              </span>
            </div>

            <a
              href={proyecto.url_proyecto}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                position: "relative",
                borderRadius: 12,
                overflow: "hidden",
                border: "2px solid #e6eaf0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 73, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
              }}
            >
              {/* Barra superior tipo navegador */}
              <div
                style={{
                  height: 36,
                  background: "#f5f5f7",
                  borderBottom: "1px solid #e6eaf0",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 12,
                  gap: 6,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ff5f56",
                  }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#ffbd2e",
                  }}
                />
                <span
                  style={{
                    display: "inline-block",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#27c93f",
                  }}
                />
              </div>
              
              {/* Screenshot del proyecto usando servicio de captura */}
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://api.screenshotone.com/take?url=${encodeURIComponent(proyecto.url_proyecto)}&viewport_width=1200&viewport_height=900&device_scale_factor=1&image_quality=80&format=jpg&block_ads=true&block_cookie_banners=true&block_banners_by_heuristics=false&block_trackers=true&delay=0&timeout=60&full_page=false&fresh=false`}
                  alt="Preview del proyecto"
                  style={{
                    width: "100%",
                    height: 450,
                    objectFit: "cover",
                    display: "block",
                    background: "#fff",
                  }}
                  onError={(e) => {
                    // Fallback: mostrar iframe si el screenshot no carga
                    const img = e.currentTarget;
                    const container = img.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <iframe
                          src="${proyecto.url_proyecto}"
                          title="Vista web del proyecto"
                          style="width: 100%; height: 550px; border: none; background: #fff; display: block;"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-top-navigation"
                          allow="fullscreen"
                        ></iframe>
                      `;
                    }
                  }}
                />
                
                {/* Overlay hover - Click para abrir */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 73, 255, 0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.3s ease",
                    pointerEvents: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0, 73, 255, 0.1)";
                  }}
                >
                  <div
                    style={{
                      background: "rgba(0, 73, 255, 0.95)",
                      color: "#fff",
                      padding: "12px 24px",
                      borderRadius: 8,
                      fontSize: 15,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      opacity: 0,
                      transform: "scale(0.9)",
                      transition: "all 0.3s ease",
                    }}
                    className="hover-text"
                  >
                    <FiExternalLink size={18} />
                    Click para ver el sitio web
                  </div>
                </div>
              </div>
            </a>
            
            <style jsx>{`
              a:hover .hover-text {
                opacity: 1 !important;
                transform: scale(1) !important;
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
