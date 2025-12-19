"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ClienteNavbarProps {
  onLogout: () => void;
}

export default function ClienteNavbar({ onLogout }: ClienteNavbarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: isMobile ? 60 : 80,
        background: "#fcfdfc",
        borderBottom: "1px solid #e6eaf0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100,
        padding: isMobile ? "0 12px" : "0 24px",
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
            width: isMobile ? "50px" : "80px",
            height: "auto",
          }}
        />
      </div>

      {/* Botón nav.png a la derecha */}
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
            width: isMobile ? "40px" : "50px",
            height: "auto",
          }}
        />
      </button>
    </nav>
  );
}
