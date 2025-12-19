"use client";
import React, { useState, useEffect } from "react";
import { sidebarStyle } from "./adminStyles";
import { FiHome, FiBell, FiUsers, FiCheckSquare, FiPlus, FiMenu, FiDollarSign, FiVideo, FiFileText, FiEdit3 } from "react-icons/fi";
import { SidebarSection } from "../types";

interface Props {
  selected: SidebarSection;
  setSelected: (section: SidebarSection) => void;
  onShowProjectModal: () => void;
  onShowClientModal: () => void;
  onShowChecklistModal: () => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const sections: { label: SidebarSection; icon: React.ReactElement }[] = [
  { label: "Proyectos", icon: <FiHome size={20} /> },
  { label: "Notificaciones", icon: <FiBell size={20} /> },
  { label: "Modificaciones", icon: <FiEdit3 size={20} /> },
  { label: "Ver clientes", icon: <FiUsers size={20} /> },
  { label: "Ver Checklist", icon: <FiCheckSquare size={20} /> },
  { label: "Pagos", icon: <FiDollarSign size={20} /> },
  { label: "Meetings", icon: <FiVideo size={20} /> },
  { label: "Presupuesto", icon: <FiFileText size={20} /> },
];

export default function AdminSidebar({
  selected,
  setSelected,
  onShowProjectModal,
  onShowClientModal,
  onShowChecklistModal,
  sidebarOpen,
  onToggleSidebar,
}: Props) {
  // Calcular total de mensajes no leídos para mostrar badge en la barra
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    // Recibe el valor desde AdminMain si lo pasas como prop, o usa un contexto global si prefieres.
    // Aquí solo se muestra el badge si totalUnread > 0
  }, [totalUnread]);

  return (
    <>
      {/* Botón fijo para abrir/cerrar la barra, siempre visible */}
      <button
        onClick={onToggleSidebar}
        style={{
          position: "fixed",
          top: 108,
          left: 8,
          background: "#fff",
          border: "1px solid #e6eaf0",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px #0002",
          cursor: "pointer",
          zIndex: 2001,
          transition: "left 0.2s",
        }}
        title={sidebarOpen ? "Cerrar barra" : "Abrir barra"}
      >
        <FiMenu size={22} color="#0049ff" />
      </button>
      <aside
        style={{
          ...sidebarStyle,
          borderRight: "1.5px solid #e6eaf0",
          height: "calc(100vh - 100px)",
          padding: "8px 0 8px 0",
          boxSizing: "border-box",
          position: "fixed",
          top: 100,
          left: 0,
          transition: "width 0.2s",
          width: sidebarOpen ? 220 : 48,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#f6f7fa",
          zIndex: 120,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <nav style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, marginTop: 8, flex: 1 }}>
          {sections.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setSelected(label)}
              style={{
                width: "90%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                outline: "none",
                borderRadius: 10,
                fontSize: 16,
                padding: "6px 10px",
                background: "transparent",
                color: selected === label ? "#0049ff" : "#222",
                fontWeight: 500,
                transition: "color 0.15s",
                cursor: "pointer",
                position: "relative",
              }}
            >
              {icon}
              {label}
              {label === "Notificaciones" && totalUnread > 0 && (
                <span style={{
                  background: "#ff3b3b",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: 13,
                  fontWeight: 700,
                  minWidth: 22,
                  height: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8,
                  padding: "0 6px",
                }}>
                  {totalUnread}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, paddingTop: 8, paddingBottom: 16, borderTop: "1px solid #e6eaf0", marginTop: "auto" }}>
          <button
            onClick={onShowClientModal}
            style={{
              width: "90%",
              margin: "0 auto",
              background: "transparent",
              border: "1px solid #ccc",
              borderRadius: 10,
              fontSize: 15,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#222",
              fontWeight: 500,
            }}
          >
            <FiPlus /> Nuevo Cliente
          </button>
          <button
            onClick={onShowProjectModal}
            style={{
              width: "90%",
              margin: "0 auto",
              background: "transparent",
              border: "1px solid #ccc",
              borderRadius: 10,
              fontSize: 15,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#222",
              fontWeight: 500,
            }}
          >
            <FiPlus /> Nuevo Proyecto
          </button>
          <button
            onClick={onShowChecklistModal}
            style={{
              width: "90%",
              margin: "0 auto",
              background: "transparent",
              border: "1px solid #ccc",
              borderRadius: 10,
              fontSize: 15,
              padding: "6px 10px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              color: "#222",
              fontWeight: 500,
            }}
          >
            <FiCheckSquare /> Ver Checklist
          </button>
        </div>
      </aside>
    </>
  );
}
