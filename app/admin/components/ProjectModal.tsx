"use client";
import React from "react";
import { Client } from "../types";

interface ProjectModalProps {
  projectForm: { nombre: string; cliente_id: string; descripcion: string; fecha_estimada: string; url_vercel: string };
  clients: Client[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function ProjectModal({ projectForm, clients, onChange, onSubmit, onClose }: ProjectModalProps) {
  // Manejador especial para el campo URL de Vercel
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    
    // Si el usuario está escribiendo y no tiene protocolo, no hacer nada aún
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      // Dejar que escriba normalmente
      onChange(e);
    } else {
      onChange(e);
    }
  };

  // Al perder el foco, agregar https:// si falta
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: 'url_vercel',
          value: `https://${value}`
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

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
    >
      <form
        onSubmit={onSubmit}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 450,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ color: "#111", fontWeight: 700, fontSize: 22, marginBottom: 8, textAlign: "center" }}>
          Crear Proyecto
        </h3>
        
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Nombre del Proyecto
          <input
            name="nombre"
            placeholder="Ej: Desarrollo de App"
            value={projectForm.nombre}
            onChange={onChange}
            required
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>

        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Cliente
          <select
            name="cliente_id"
            value={projectForm.cliente_id}
            onChange={onChange}
            required
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          >
            <option value="" disabled>
              Seleccionar cliente
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>

        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Descripción
          <textarea
            name="descripcion"
            placeholder="Describe el proyecto..."
            value={projectForm.descripcion}
            onChange={onChange}
            required
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              minHeight: 80,
              resize: "vertical",
            }}
          />
        </label>

        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Fecha Estimada de Finalización
          <input
            type="date"
            name="fecha_estimada"
            value={projectForm.fecha_estimada}
            onChange={onChange}
            required
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>

        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          URL de Vercel (Preview)
          <input
            type="text"
            name="url_vercel"
            placeholder="arquitecto-luis-prado-e9ot-git-main-vmstudios-projects.vercel.app"
            value={projectForm.url_vercel}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
          <span style={{ fontSize: 13, color: "#10b981", marginTop: -2, fontWeight: 500 }}>
            ✓ Se agregará https:// automáticamente si lo olvidas
          </span>
          <span style={{ fontSize: 12, color: "#666", marginTop: -4 }}>
            Puedes pegar solo: arquitecto-luis-prado-e9ot-git-main-vmstudios-projects.vercel.app
          </span>
        </label>

        <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "#eee",
              color: "#111",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: 16,
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              background: "#0049ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            Crear Proyecto
          </button>
        </div>
      </form>
    </div>
  );
}
