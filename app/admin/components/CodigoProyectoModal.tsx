"use client";
import React from "react";

interface CodigoProyectoModalProps {
  codigo: string;
  onClose: () => void;
}

export default function CodigoProyectoModal({ codigo, onClose }: CodigoProyectoModalProps) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1002,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 40,
          minWidth: 400,
          textAlign: "center",
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ color: "#111", fontWeight: 700, fontSize: 22, marginBottom: 16 }}>
          ¡Proyecto Creado!
        </h3>
        <p style={{ color: "#666", fontSize: 16, marginBottom: 24 }}>
          Comparte este código con el cliente para que pueda acceder a su proyecto:
        </p>
        <div
          style={{
            background: "#f6f7fa",
            padding: "20px 30px",
            borderRadius: 8,
            marginBottom: 24,
            border: "2px solid #0049ff",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#0049ff",
            }}
          >
            {codigo}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "#0049ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 32px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
