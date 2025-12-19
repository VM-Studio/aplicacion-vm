"use client";
import React from "react";
import Image from "next/image";
import { navStyle } from "./adminStyles";

export default function AdminNavbar({ onLogout }: { onLogout: () => void }) {
  return (
    <nav style={navStyle}>
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Image
          src="/navbar.gif"
          alt="Logo"
          width={80}
          height={80}
          style={{
            objectFit: "contain",
            marginLeft: 24,
          }}
        />
      </div>
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
