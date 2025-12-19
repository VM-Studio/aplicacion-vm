"use client";
import React, { useState, useEffect } from "react";
import { sidebarStyle } from "./adminStyles";
import { FiHome, FiBell, FiUsers, FiCheckSquare, FiPlus, FiDollarSign, FiVideo, FiFileText, FiEdit3, FiChevronLeft, FiChevronRight } from "react-icons/fi";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar tamaño de pantalla
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Recibe el valor desde AdminMain si lo pasas como prop, o usa un contexto global si prefieres.
    // Aquí solo se muestra el badge si totalUnread > 0
  }, [totalUnread]);

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          onClick={onToggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 119,
          }}
        />
      )}

      <aside
        style={{
          ...sidebarStyle,
          borderRight: "1.5px solid #e6eaf0",
          height: isMobile ? "100vh" : "calc(100vh - 100px)",
          padding: "8px 0 8px 0",
          boxSizing: "border-box",
          position: "fixed",
          top: isMobile ? 0 : 100,
          left: isMobile && !sidebarOpen ? "-100%" : 0,
          transition: "all 0.3s ease",
          width: isMobile ? (sidebarOpen ? "280px" : "0") : (sidebarOpen ? 220 : 48),
          overflowY: "auto",
          overflowX: "hidden",
          background: "#f6f7fa",
          zIndex: 120,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Botón toggle en esquina superior derecha */}
        {!isMobile && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleSidebar();
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              width: 32,
              height: 32,
              padding: 0,
              background: "#fff",
              border: "1px solid #e6eaf0",
              borderRadius: 8,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              color: "#0049ff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              zIndex: 200,
            }}
            title={sidebarOpen ? "Contraer barra" : "Expandir barra"}
          >
            {sidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        )}
        
        <nav style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, marginTop: isMobile ? 60 : 8, flex: 1 }}>
          {sections.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => {
                setSelected(label);
                if (isMobile) onToggleSidebar();
              }}
              style={{
                width: "90%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: "none",
                outline: "none",
                borderRadius: 10,
                fontSize: isMobile ? 15 : 16,
                padding: isMobile ? "10px 12px" : "8px 10px",
                background: "transparent",
                color: selected === label ? "#0049ff" : "#222",
                fontWeight: 500,
                transition: "color 0.15s",
                cursor: "pointer",
                position: "relative",
                whiteSpace: isMobile || sidebarOpen ? "nowrap" : "normal",
                justifyContent: isMobile || sidebarOpen ? "flex-start" : "center",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                {icon}
              </span>
              {(isMobile || sidebarOpen) && <span>{label}</span>}
              {label === "Notificaciones" && totalUnread > 0 && (isMobile || sidebarOpen) && (
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
        {(isMobile || sidebarOpen) && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6, paddingTop: 8, paddingBottom: 16, borderTop: "1px solid #e6eaf0", marginTop: "auto" }}>
            <button
              onClick={() => {
                onShowClientModal();
                if (isMobile) onToggleSidebar();
              }}
              style={{
                width: "90%",
                margin: "0 auto",
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: 10,
                fontSize: isMobile ? 14 : 15,
                padding: isMobile ? "10px 12px" : "6px 10px",
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
              onClick={() => {
                onShowProjectModal();
                if (isMobile) onToggleSidebar();
              }}
              style={{
                width: "90%",
                margin: "0 auto",
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: 10,
                fontSize: isMobile ? 14 : 15,
                padding: isMobile ? "10px 12px" : "6px 10px",
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
              onClick={() => {
                onShowChecklistModal();
                if (isMobile) onToggleSidebar();
              }}
              style={{
                width: "90%",
                margin: "0 auto",
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: 10,
                fontSize: isMobile ? 14 : 15,
                padding: isMobile ? "10px 12px" : "6px 10px",
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
        )}
      </aside>
    </>
  );
}
