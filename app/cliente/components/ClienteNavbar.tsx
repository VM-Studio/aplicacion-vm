"use client";
import React from "react";
import Image from "next/image";

interface ClienteNavbarProps {
  onLogout: () => void;
}

export default function ClienteNavbar({ onLogout }: ClienteNavbarProps) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        background: "#fcfdfc",
        borderBottom: "1px solid #e6eaf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100,
      }}
    >
      {/* Logo navbar.gif a la izquierda */}
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Image
          src="/navbar.gif"
          alt="VM Studio"
          width={80}
          height={80}
          style={{
            objectFit: "contain",
            marginLeft: 24,
          }}
        />
      </div>

      {/* Botón cerrar.gif a la derecha */}
      <button
        onClick={onLogout}
        style={{
          marginRight: 32,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <Image
          src="/cerrar.gif"
          alt="Cerrar sesión"
          width={50}
          height={50}
          style={{
            objectFit: "contain",
          }}
        />
      </button>
    </nav>
  );
}
