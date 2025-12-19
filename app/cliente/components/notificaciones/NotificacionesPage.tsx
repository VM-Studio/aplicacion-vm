"use client";

import { FiSend, FiMessageCircle } from "react-icons/fi";

interface Message {
  id: string;
  project_id: string;
  sender: "client" | "admin";
  text: string;
  timestamp: string;
  read: boolean;
}

export default function NotificacionesPage({ 
  messages, 
  chatInput, 
  setChatInput, 
  handleSendMessage, 
  chatEndRef 
}: {
  messages: Message[];
  chatInput: string;
  setChatInput: (value: string) => void;
  handleSendMessage: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid #e6eaf0",
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 140px)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header minimalista */}
      <div
        style={{
          background: "rgba(0, 73, 255, 0.04)",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(0, 73, 255, 0.1)",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 18,
            color: "#111",
            letterSpacing: "-0.3px",
          }}
        >
          Mensajes con el Administrador
        </div>
        {messages.length > 0 && (
          <div
            style={{
              fontSize: 13,
              color: "#666",
              marginTop: 4,
            }}
          >
            {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"}
          </div>
        )}
      </div>

      {/* Área de mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          background: "#fafbfc",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "100px 20px",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(0, 73, 255, 0.06)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <FiMessageCircle size={36} color="rgba(0, 73, 255, 0.4)" strokeWidth={2} />
            </div>
            <p style={{ 
              color: "#111", 
              fontSize: 16, 
              fontWeight: 600,
              margin: 0,
              marginBottom: 6,
            }}>
              No hay mensajes
            </p>
            <p style={{ 
              color: "#666", 
              fontSize: 14, 
              margin: 0,
            }}>
              Inicia la conversación con el administrador
            </p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isClient = m.sender === "client";
            
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isClient ? "flex-end" : "flex-start",
                  gap: 6,
                }}
              >
                {/* Nombre del remitente */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#666",
                    paddingLeft: 4,
                    paddingRight: 4,
                  }}
                >
                  {isClient ? "Tú" : "Administrador"}
                </div>

                {/* Burbuja del mensaje */}
                <div
                  style={{
                    background: isClient 
                      ? "rgba(0, 73, 255, 0.95)"
                      : "#ffffff",
                    color: isClient ? "#fff" : "#111",
                    borderRadius: 12,
                    padding: "12px 16px",
                    maxWidth: "70%",
                    fontSize: 15,
                    lineHeight: 1.5,
                    boxShadow: isClient
                      ? "0 2px 8px rgba(0, 73, 255, 0.2)"
                      : "0 2px 8px rgba(0, 0, 0, 0.06)",
                    border: isClient ? "none" : "1px solid #e6eaf0",
                    wordWrap: "break-word",
                  }}
                >
                  {m.text}
                </div>

                {/* Timestamp */}
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    paddingLeft: 4,
                    paddingRight: 4,
                  }}
                >
                  {new Date(m.timestamp).toLocaleTimeString("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area minimalista */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid #e6eaf0",
          background: "#fff",
          display: "flex",
          gap: 12,
        }}
      >
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && chatInput.trim()) handleSendMessage();
          }}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            border: "1px solid #e6eaf0",
            borderRadius: 10,
            padding: "12px 16px",
            fontSize: 15,
            outline: "none",
            color: "#111",
            background: "#fff",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "rgba(0, 73, 255, 0.4)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 73, 255, 0.08)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#e6eaf0";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        
        <button
          onClick={handleSendMessage}
          disabled={!chatInput.trim()}
          style={{
            background: chatInput.trim() 
              ? "rgba(0, 73, 255, 0.95)"
              : "#f1f3f5",
            color: chatInput.trim() ? "#fff" : "#aaa",
            border: "none",
            borderRadius: 10,
            padding: "0 24px",
            fontWeight: 600,
            fontSize: 15,
            cursor: chatInput.trim() ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => {
            if (chatInput.trim()) {
              e.currentTarget.style.background = "#0049ff";
            }
          }}
          onMouseLeave={(e) => {
            if (chatInput.trim()) {
              e.currentTarget.style.background = "rgba(0, 73, 255, 0.95)";
            }
          }}
        >
          <FiSend size={16} strokeWidth={2.5} />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  );
}
