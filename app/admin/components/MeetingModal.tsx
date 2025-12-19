"use client";
import React from "react";

export interface MeetingForm {
  id: string;
  proyecto_id: string;
  titulo: string;
  fecha: string;
  hora: string;
  duracion: string;
  tipo: "Presencial" | "Virtual" | "Telefónica";
  estado: "Programada" | "Completada" | "Cancelada";
  asistentes: string;
  notas: string;
  link_reunion: string;
}

interface MeetingModalProps {
  meetingForm: MeetingForm;
  projects: { id: string; nombre: string; codigo: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function MeetingModal({
  meetingForm,
  projects,
  onChange,
  onSubmit,
  onClose,
}: MeetingModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 600,
          maxWidth: 700,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            color: "#111",
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {meetingForm.id ? "Editar Reunión" : "Agendar Nueva Reunión"}
        </h3>

        {/* Proyecto */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Proyecto *
          <select
            name="proyecto_id"
            value={meetingForm.proyecto_id}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              cursor: "pointer",
            }}
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nombre} ({project.codigo})
              </option>
            ))}
          </select>
        </label>

        {/* Título */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Título de la reunión *
          <input
            name="titulo"
            type="text"
            placeholder="Ej: Revisión de avances del proyecto"
            value={meetingForm.titulo}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>

        {/* Fecha y Hora */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label
            style={{
              color: "#111",
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            Fecha *
            <input
              name="fecha"
              type="date"
              value={meetingForm.fecha}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
                color: "#111",
              }}
            />
          </label>

          <label
            style={{
              color: "#111",
              fontWeight: 500,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            Hora *
            <input
              name="hora"
              type="time"
              value={meetingForm.hora}
              onChange={onChange}
              required
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 16,
                color: "#111",
              }}
            />
          </label>
        </div>

        {/* Duración */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Duración *
          <input
            name="duracion"
            type="text"
            placeholder="Ej: 1 hora, 30 minutos, etc."
            value={meetingForm.duracion}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>

        {/* Tipo */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Tipo de reunión *
          <select
            name="tipo"
            value={meetingForm.tipo}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              cursor: "pointer",
            }}
          >
            <option value="Virtual">Virtual (Google Meet)</option>
            <option value="Presencial">Presencial</option>
            <option value="Telefónica">Telefónica</option>
          </select>
        </label>

        {/* Link de reunión - Solo para Virtual */}
        {meetingForm.tipo === "Virtual" && (
          <div
            style={{
              padding: "12px 16px",
              background: "#f0f7ff",
              border: "1px solid #0049ff",
              borderRadius: 8,
            }}
          >
            <p style={{ fontSize: 13, color: "#0049ff", marginBottom: 4, fontWeight: 600 }}>
              📹 Link de Google Meet
            </p>
            <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
              Se generará automáticamente un link único de Google Meet para esta reunión
            </p>
            {meetingForm.link_reunion && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="text"
                  value={meetingForm.link_reunion}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 12,
                    color: "#666",
                    background: "#fff",
                  }}
                />
                <a
                  href={meetingForm.link_reunion}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 12px",
                    background: "#0049ff",
                    color: "#fff",
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Abrir
                </a>
              </div>
            )}
          </div>
        )}

        {/* Estado */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Estado *
          <select
            name="estado"
            value={meetingForm.estado}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              cursor: "pointer",
            }}
          >
            <option value="Programada">Programada</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </label>

        {/* Asistentes */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Asistentes
          <input
            name="asistentes"
            type="text"
            placeholder="Separa con comas: Juan Pérez, María García, etc."
            value={meetingForm.asistentes}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
          <p style={{ fontSize: 12, color: "#666", marginTop: -2 }}>
            Ingresa los nombres separados por comas
          </p>
        </label>

        {/* Notas */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Notas / Agenda
          <textarea
            name="notas"
            placeholder="Temas a tratar, objetivos de la reunión, etc."
            value={meetingForm.notas}
            onChange={onChange}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </label>

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#666",
              border: "1px solid #ccc",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f6f7fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              background: "#0049ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0041dd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0049ff";
            }}
          >
            {meetingForm.id ? "Actualizar Reunión" : "Agendar Reunión"}
          </button>
        </div>
      </form>
    </div>
  );
}
