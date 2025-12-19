"use client";
import React, { useState, useMemo } from "react";
import { Project, Client } from "../../types";
import {
  FiSearch,
  FiFilter,
  FiVideo,
  FiCalendar,
  FiUser,
  FiClock,
  FiMapPin,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
} from "react-icons/fi";

interface Meeting {
  id: string;
  proyecto_id: string;
  titulo: string;
  fecha: string;
  hora: string;
  duracion: string;
  tipo: "Presencial" | "Virtual" | "Telefónica";
  estado: "Programada" | "Completada" | "Cancelada";
  asistentes: string[];
  notas: string;
  link_reunion?: string;
}

interface MeetingsPageProps {
  projects: Project[];
  clients: Client[];
  meetings: Meeting[];
  onAddMeeting: () => void;
  onEditMeeting: (meeting: Meeting) => void;
  onDeleteMeeting: (meetingId: string) => void;
}

export default function MeetingsPage({ 
  projects, 
  clients, 
  meetings,
  onAddMeeting,
  onEditMeeting,
  onDeleteMeeting 
}: MeetingsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [filterType, setFilterType] = useState<string>("Todos");

  // Filtrar meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const project = projects.find((p) => p.id === meeting.proyecto_id);
      const client = clients.find((c) => c.id === project?.cliente_id);

      const matchesSearch =
        meeting.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "Todos" || meeting.estado === filterStatus;
      const matchesType = filterType === "Todos" || meeting.tipo === filterType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [meetings, searchQuery, filterStatus, filterType, projects, clients]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = meetings.length;
    const programadas = meetings.filter((m) => m.estado === "Programada").length;
    const completadas = meetings.filter((m) => m.estado === "Completada").length;
    const canceladas = meetings.filter((m) => m.estado === "Cancelada").length;

    return { total, programadas, completadas, canceladas };
  }, [meetings]);

  // Obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Programada":
        return { bg: "rgba(0, 73, 255, 0.1)", color: "#0049ff" };
      case "Completada":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "Cancelada":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" };
      default:
        return { bg: "#f6f7fa", color: "#666" };
    }
  };

  // Obtener icono según tipo
  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Virtual":
        return <FiVideo size={16} />;
      case "Presencial":
        return <FiMapPin size={16} />;
      case "Telefónica":
        return <FiClock size={16} />;
      default:
        return null;
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 100px)",
        background: "#f6f7fa",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "32px 40px",
          borderBottom: "1px solid #e6eaf0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
              Meetings & Reuniones
            </h1>
            <p style={{ fontSize: 15, color: "#666" }}>
              Agenda y coordina reuniones con tus clientes
            </p>
          </div>
          <button
            onClick={onAddMeeting}
            style={{
              padding: "12px 24px",
              background: "#0049ff",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0041dd";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 73, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0049ff";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FiPlus size={18} />
            Nueva Reunión
          </button>
        </div>

        {/* Estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Total */}
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
                <FiCalendar size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Total Reuniones</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Programadas */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Programadas</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.programadas}</p>
              </div>
            </div>
          </div>

          {/* Completadas */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Completadas</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.completadas}</p>
              </div>
            </div>
          </div>

          {/* Canceladas */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Canceladas</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.canceladas}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Búsqueda */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
            }}
          >
            <FiSearch size={18} color="#666" />
            <input
              type="text"
              placeholder="Buscar por título, proyecto o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                width: "100%",
              }}
            />
          </div>

          {/* Filtro por estado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
              minWidth: 180,
            }}
          >
            <FiFilter size={18} color="#666" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                cursor: "pointer",
              }}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Programada">Programada</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>

          {/* Filtro por tipo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
              minWidth: 180,
            }}
          >
            <FiFilter size={18} color="#666" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                cursor: "pointer",
              }}
            >
              <option value="Todos">Todos los tipos</option>
              <option value="Virtual">Virtual</option>
              <option value="Presencial">Presencial</option>
              <option value="Telefónica">Telefónica</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div
        style={{
          padding: "16px 40px",
          background: "#fff",
          borderBottom: "1px solid #e6eaf0",
        }}
      >
        <p style={{ fontSize: 14, color: "#666" }}>
          Mostrando{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{filteredMeetings.length}</span> de{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{meetings.length}</span> reuniones
        </p>
      </div>

      {/* Contenido */}
      <div style={{ padding: 40 }}>
        {filteredMeetings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: 16,
              border: "2px dashed #e6eaf0",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#f6f7fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <FiVideo size={32} color="#ccc" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
              No hay reuniones programadas
            </h3>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
              {searchQuery || filterStatus !== "Todos" || filterType !== "Todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agendando tu primera reunión"}
            </p>
            {!searchQuery && filterStatus === "Todos" && filterType === "Todos" && (
              <button
                onClick={onAddMeeting}
                style={{
                  padding: "12px 24px",
                  background: "#0049ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FiPlus size={18} />
                Agendar Reunión
              </button>
            )}
          </div>
        ) : (
          // Grid de meetings
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
              gap: 24,
            }}
          >
            {filteredMeetings.map((meeting) => {
              const project = projects.find((p) => p.id === meeting.proyecto_id);
              const client = clients.find((c) => c.id === project?.cliente_id);
              const estadoStyle = getEstadoColor(meeting.estado);

              return (
                <div
                  key={meeting.id}
                  style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    border: "1px solid #e6eaf0",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "#0049ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "#e6eaf0";
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#111",
                          marginBottom: 8,
                          fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {meeting.titulo}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            background: "#f6f7fa",
                            borderRadius: 6,
                            fontSize: 12,
                            color: "#666",
                          }}
                        >
                          {getTipoIcon(meeting.tipo)}
                          {meeting.tipo}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: estadoStyle.bg,
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        color: estadoStyle.color,
                      }}
                    >
                      {meeting.estado}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Fecha y Hora */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#f6f7fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiCalendar size={16} color="#666" />
                      </div>
                      <div>
                        <p style={{ fontSize: 14, color: "#111", fontWeight: 600 }}>
                          {formatDate(meeting.fecha)}
                        </p>
                        <p style={{ fontSize: 13, color: "#666" }}>
                          {meeting.hora} • {meeting.duracion}
                        </p>
                      </div>
                    </div>

                    {/* Proyecto */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#0049ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {project?.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Proyecto</p>
                        <p style={{ fontSize: 14, color: "#111", fontWeight: 600 }}>
                          {project?.nombre || "Proyecto desconocido"}
                        </p>
                      </div>
                    </div>

                    {/* Cliente */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#f6f7fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiUser size={16} color="#666" />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Cliente</p>
                        <p style={{ fontSize: 14, color: "#111" }}>
                          {client?.nombre || "Cliente desconocido"}
                        </p>
                      </div>
                    </div>

                    {/* Asistentes */}
                    {meeting.asistentes.length > 0 && (
                      <div
                        style={{
                          padding: "12px",
                          background: "#f6f7fa",
                          borderRadius: 8,
                        }}
                      >
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                          Asistentes ({meeting.asistentes.length})
                        </p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {meeting.asistentes.map((asistente, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: "4px 10px",
                                background: "#fff",
                                borderRadius: 6,
                                fontSize: 12,
                                color: "#666",
                              }}
                            >
                              {asistente}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notas */}
                    {meeting.notas && (
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            background: "#f6f7fa",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <FiFileText size={16} color="#666" />
                        </div>
                        <div>
                          <p style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>Notas</p>
                          <p
                            style={{
                              fontSize: 13,
                              color: "#666",
                              lineHeight: 1.5,
                            }}
                          >
                            {meeting.notas}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Link de reunión */}
                    {meeting.link_reunion && meeting.tipo === "Virtual" && (
                      <a
                        href={meeting.link_reunion}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: "10px 16px",
                          background: "#0049ff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          transition: "all 0.2s",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#0041dd";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#0049ff";
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FiVideo size={16} />
                        Unirse a la reunión
                        <FiExternalLink size={14} />
                      </a>
                    )}

                    {/* Botones de acción */}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditMeeting(meeting);
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: "#fff",
                          color: "#0049ff",
                          border: "1px solid #0049ff",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#0049ff";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = "#0049ff";
                        }}
                      >
                        <FiEdit2 size={16} />
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("¿Estás seguro de eliminar esta reunión?")) {
                            onDeleteMeeting(meeting.id);
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "10px",
                          background: "#fff",
                          color: "#ef4444",
                          border: "1px solid #ef4444",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#ef4444";
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = "#ef4444";
                        }}
                      >
                        <FiTrash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
