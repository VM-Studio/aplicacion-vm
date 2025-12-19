"use client";
import React from "react";
import {
  FiFolder,
  FiCheckSquare,
  FiBell,
  FiDollarSign,
} from "react-icons/fi";

export type ClienteSidebarSection =
  | "Proyecto"
  | "Checklist"
  | "Notificaciones"
  | "Pagos";

interface ClienteSidebarProps {
  selected: ClienteSidebarSection;
  setSelected: (section: ClienteSidebarSection) => void;
  unreadCount?: number;
  isMobile?: boolean;
  isOpen?: boolean;
}

const sections: {
  id: ClienteSidebarSection;
  label: string;
  icon: React.ReactNode;
  showBadge?: boolean;
}[] = [
  { id: "Proyecto", label: "Mi Proyecto", icon: <FiFolder size={20} /> },
  { id: "Checklist", label: "Checklist", icon: <FiCheckSquare size={20} /> },
  { id: "Notificaciones", label: "Notificaciones", icon: <FiBell size={20} />, showBadge: true },
  { id: "Pagos", label: "Pagos", icon: <FiDollarSign size={20} /> },
];

export default function ClienteSidebar({
  selected,
  setSelected,
  unreadCount = 0,
  isMobile = false,
  isOpen = false,
}: ClienteSidebarProps) {
  return (
    <aside
      style={{
        position: "fixed",
        top: isMobile ? 0 : 80,
        left: isMobile && !isOpen ? "-100%" : 0,
        bottom: 0,
        width: isMobile ? "280px" : 260,
        background: "#fff",
        borderRight: "1.5px solid #e6eaf0",
        padding: isMobile ? "80px 0 24px 0" : "32px 0 24px 0",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        zIndex: 99,
        boxSizing: "border-box",
        transition: "left 0.3s ease",
      }}
    >
      <nav
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {sections.map((section) => {
          const isActive = selected === section.id;
          const showBadge = section.showBadge && unreadCount > 0;

          return (
            <button
              key={section.id}
              onClick={() => setSelected(section.id)}
              style={{
                width: "90%",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "none",
                outline: "none",
                borderRadius: 10,
                fontSize: 16,
                padding: "12px 18px",
                background: isActive
                  ? "linear-gradient(90deg, #0049ff 0%, #0066ff 100%)"
                  : "transparent",
                color: isActive ? "#fff" : "#222",
                fontWeight: 500,
                transition: "background 0.15s, color 0.15s, transform 0.1s",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f6f7fa";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              {section.icon}
              {section.label}
              {showBadge && (
                <span
                  style={{
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
                    marginLeft: "auto",
                    padding: "0 6px",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
