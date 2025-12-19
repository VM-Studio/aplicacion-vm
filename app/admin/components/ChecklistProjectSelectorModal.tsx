"use client";
import React from "react";
import { Project } from "../types";

interface ChecklistProjectSelectorModalProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onClose: () => void;
}

export default function ChecklistProjectSelectorModal({ 
  projects, 
  onSelect, 
  onClose 
}: ChecklistProjectSelectorModalProps) {
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
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 400,
          maxWidth: 500,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ color: "#111", fontWeight: 700, fontSize: 22, textAlign: "center" }}>
          Selecciona un Proyecto
        </h3>

        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {projects.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: 20 }}>
              No hay proyectos disponibles. Crea uno primero.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    onClick={() => onSelect(project)}
                    style={{
                      width: "100%",
                      background: "#f6f7fa",
                      border: "1px solid #e6eaf0",
                      borderRadius: 8,
                      padding: "14px 18px",
                      fontSize: 16,
                      cursor: "pointer",
                      textAlign: "left",
                      color: "#222",
                      fontWeight: 500,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#e6eaf0";
                      e.currentTarget.style.borderColor = "#0049ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f6f7fa";
                      e.currentTarget.style.borderColor = "#e6eaf0";
                    }}
                  >
                    {project.nombre}
                    <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>
                      Código: {project.codigo}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
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
            marginTop: 10,
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
