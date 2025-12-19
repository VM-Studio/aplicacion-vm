"use client";
import React from "react";
import Image from "next/image";
import { navStyle } from "./adminStyles";

export default function AdminNavbar({ onLogout }: { onLogout: () => void }) {
  return (
    <nav style={{
      ...navStyle,
      padding: "0 clamp(12px, 3vw, 32px)",
    }}>
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Image
          src="/navbar.gif"
          alt="Logo"
          width={80}
          height={80}
          style={{
            objectFit: "contain",
            width: "clamp(40px, 8vw, 80px)",
            height: "auto",
          }}
        />
      </div>
      <button
        onClick={onLogout}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <Image
          src="/nav.png"
          alt="Cerrar sesión"
          width={50}
          height={50}
          style={{
            objectFit: "contain",
            width: "clamp(35px, 6vw, 50px)",
            height: "auto",
          }}
        />
      </button>
    </nav>
  );
}
