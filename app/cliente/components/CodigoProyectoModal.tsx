"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Props {
  onValidate: (codigo: string) => Promise<boolean>;
}

export default function CodigoProyectoModal({ onValidate }: Props) {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const codigoLimpio = codigo.trim().toUpperCase();
    
    // Aceptar códigos de 6 u 8 caracteres (compatibilidad)
    if (codigoLimpio.length < 6 || codigoLimpio.length > 8) {
      setError("El código debe tener entre 6 y 8 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const isValid = await onValidate(codigoLimpio);
      if (!isValid) {
        setError("Código de proyecto inválido. Por favor verifica e intenta de nuevo.");
        setCodigo("");
      }
    } catch {
      setError("Error al validar el código. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 8) {
      setCodigo(value);
      setError("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: 'Inter, Roboto, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif',
        fontWeight: 400,
        letterSpacing: 0.1,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 420,
          background: "#fcfdfc",
          borderRadius: 16,
          boxShadow: "0 2px 24px #0002",
          padding: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: 'Inter, Roboto, Segoe UI, Helvetica Neue, Arial, Liberation Sans, sans-serif',
          fontWeight: 400,
          letterSpacing: 0.1,
        }}
      >
        {/* Logo GIF */}
        <Image
          src="/navbar.gif"
          alt="VM Studio"
          width={120}
          height={120}
          style={{ marginBottom: 20 }}
        />

        {/* Título */}
        <h2
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 8,
            color: "#222",
            textAlign: "center",
          }}
        >
          Accede a tu Proyecto
        </h2>

        <p
          style={{
            fontSize: 15,
            color: "#666",
            marginBottom: 28,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Ingresa el código único de tu proyecto
        </p>

        {/* Input del código */}
        <div style={{ width: "100%", marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              fontSize: 15,
              fontWeight: 500,
              marginBottom: 4,
              color: "#111",
              fontFamily: "inherit",
            }}
          >
            Código de Proyecto
          </label>
          <input
            type="text"
            placeholder="Ej: TH9YCA48"
            value={codigo}
            onChange={handleInputChange}
            disabled={loading}
            autoFocus
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 7,
              border: error ? "1px solid #d00" : "1px solid #ccc",
              fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
              color: "#111",
              fontSize: 16,
              letterSpacing: 2,
              textAlign: "center",
              fontWeight: 600,
              textTransform: "uppercase",
              background: loading ? "#f5f5f5" : "#fff",
              transition: "all 0.2s",
            }}
          />
          {error && (
            <div
              style={{
                color: "#d00",
                marginTop: 8,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Botón de submit */}
        <button
          type="submit"
          disabled={loading || codigo.length < 6}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 7,
            background: loading || codigo.length < 6 ? "#ccc" : "#0049ff",
            color: "#fff",
            fontWeight: 700,
            border: "none",
            marginBottom: 12,
            fontSize: 17,
            fontFamily: "inherit",
            cursor: loading || codigo.length < 6 ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Validando código..." : "Acceder al Panel"}
        </button>

        {/* Info adicional */}
        <div
          style={{
            width: "100%",
            marginTop: 12,
            padding: 16,
            background: "#f0f9ff",
            borderRadius: 8,
            border: "1px solid #b3d1ff",
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "#0049ff",
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "inherit",
            }}
          >
            <strong>💡 Tip:</strong> El código de tu proyecto tiene entre 6 y 8
            caracteres. Lo recibiste por email cuando se creó tu proyecto. Si no lo
            encuentras, contacta a tu administrador.
          </p>
        </div>
      </form>
    </div>
  );
}
