"use client";
import { useState } from "react";

interface VercelPreviewProps {
  url: string;
}

export default function VercelPreview({ url }: VercelPreviewProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Botón flotante para ver la web en Vercel */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          background: "linear-gradient(135deg, #0049ff 0%, #0066ff 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 16,
          padding: "18px 32px",
          fontSize: 16,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 24px rgba(0, 73, 255, 0.4)",
          transition: "all 0.3s ease",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 73, 255, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 73, 255, 0.4)";
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Ver mi Web en Vivo
      </button>

      {/* Modal de vista previa fullscreen */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 40,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: "100%",
              maxWidth: 1400,
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
            }}
          >
            {/* Header del modal */}
            <div
              style={{
                padding: "24px 32px",
                borderBottom: "1px solid #e6eaf0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#111" }}>
                  Vista Previa de tu Sitio Web
                </h2>
                <p style={{ margin: "8px 0 0", fontSize: 14, color: "#666" }}>
                  Aquí puedes ver los cambios en tiempo real
                </p>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#0049ff",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0041dd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0049ff";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Abrir en nueva pestaña
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#f6f7fa",
                    border: "none",
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    color: "#666",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e6eaf0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f6f7fa";
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* URL Bar */}
            <div
              style={{
                padding: "16px 32px",
                background: "#f6f7fa",
                borderBottom: "1px solid #e6eaf0",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 8,
                  padding: "10px 16px",
                  fontSize: 14,
                  color: "#666",
                  fontFamily: "'SF Mono', 'Monaco', 'Menlo', monospace",
                  border: "1px solid #e6eaf0",
                }}
              >
                {url}
              </div>
              <button
                onClick={() => {
                  const iframe = document.querySelector('iframe[title="Vista previa de tu sitio web"]') as HTMLIFrameElement;
                  if (iframe) {
                    iframe.src = iframe.src;
                  }
                }}
                style={{
                  background: "#fff",
                  border: "1px solid #e6eaf0",
                  borderRadius: 8,
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#0049ff",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f6f7fa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                }}
              >
                🔄 Recargar
              </button>
            </div>

            {/* iframe con la web */}
            <div style={{ flex: 1, background: "#fff", position: "relative" }}>
              <iframe
                src={url}
                title="Vista previa de tu sitio web"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background: "#fff",
                }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-top-navigation"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
