"use client";
import React from "react";
import { ClientForm } from "../types";

interface ClientModalProps {
  clientForm: ClientForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function ClientModal({ clientForm, onChange, onSubmit, onClose }: ClientModalProps) {
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
          minWidth: 500,
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3 style={{ color: "#111", fontWeight: 700, fontSize: 22, marginBottom: 8, textAlign: "center" }}>
          {clientForm.id ? "Editar Cliente" : "Nuevo Cliente"}
        </h3>
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Nombre del Cliente
          <input
            name="nombre"
            placeholder="Ej: Juan Pérez"
            value={clientForm.nombre}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Rubro
          <input
            name="rubro"
            placeholder="Ej: Tecnología, Salud, etc."
            value={clientForm.rubro}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Email
          <input
            name="email"
            type="email"
            placeholder="Ej: cliente@empresa.com"
            value={clientForm.email}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Teléfono
          <input
            name="telefono"
            type="tel"
            placeholder="Ej: +54 9 11 1234-5678"
            value={clientForm.telefono}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Dirección
          <input
            name="direccion"
            placeholder="Ej: Av. Corrientes 1234, CABA"
            value={clientForm.direccion}
            onChange={onChange}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
            }}
          />
        </label>
        <label style={{ color: "#111", fontWeight: 500, display: "flex", flexDirection: "column", gap: 6 }}>
          Notas
          <textarea
            name="notas"
            placeholder="Información adicional del cliente..."
            value={clientForm.notas}
            onChange={onChange}
            rows={4}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
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
            Guardar Cliente
          </button>
        </div>
      </form>
    </div>
  );
}
