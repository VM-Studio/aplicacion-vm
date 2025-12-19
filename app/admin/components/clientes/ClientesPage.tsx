"use client";
import React, { useState } from "react";
import { Client } from "../../types";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiGrid,
  FiList,
} from "react-icons/fi";

interface ClientesPageProps {
  clients: Client[];
  onEdit?: (client: Client) => void;
  onDelete?: (clientId: string) => void;
  onAdd?: () => void;
}

export default function ClientesPage({ clients, onEdit, onDelete, onAdd }: ClientesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRubro, setFilterRubro] = useState<string>("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Obtener rubros únicos
  const rubros = ["Todos", ...Array.from(new Set(clients.map((c) => c.rubro)))];

  // Filtrar clientes
  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.telefono.includes(searchQuery);
    const matchesRubro = filterRubro === "Todos" || client.rubro === filterRubro;
    return matchesSearch && matchesRubro;
  });

  return (
    <div
      style={{
        height: "calc(100vh - 100px)",
        background: "#f6f7fa",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "32px 40px",
          borderBottom: "1px solid #e6eaf0",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
              Clientes
            </h1>
            <p style={{ fontSize: 15, color: "#666" }}>
              Administra tu cartera de clientes
            </p>
          </div>
          <button
            onClick={onAdd}
            style={{
              padding: "12px 24px",
              background: "#0049ff",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0041dd";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 73, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0049ff";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <FiPlus size={18} />
            Nuevo Cliente
          </button>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          {/* Búsqueda */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
            }}
          >
            <FiSearch size={18} color="#666" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                width: "100%",
              }}
            />
          </div>

          {/* Filtro por rubro */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
              minWidth: 200,
            }}
          >
            <FiFilter size={18} color="#666" />
            <select
              value={filterRubro}
              onChange={(e) => setFilterRubro(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                cursor: "pointer",
              }}
            >
              {rubros.map((rubro) => (
                <option key={rubro} value={rubro}>
                  {rubro}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle de vista */}
          <div
            style={{
              display: "flex",
              background: "#f6f7fa",
              borderRadius: 10,
              padding: 4,
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "8px 16px",
                background: viewMode === "grid" ? "#fff" : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s",
                boxShadow: viewMode === "grid" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
              }}
            >
              <FiGrid size={18} color={viewMode === "grid" ? "#0049ff" : "#666"} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "8px 16px",
                background: viewMode === "list" ? "#fff" : "transparent",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                transition: "all 0.2s",
                boxShadow: viewMode === "list" ? "0 1px 3px rgba(0, 0, 0, 0.1)" : "none",
              }}
            >
              <FiList size={18} color={viewMode === "list" ? "#0049ff" : "#666"} />
            </button>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div style={{ padding: "16px 40px", background: "#fff", borderBottom: "1px solid #e6eaf0" }}>
        <p style={{ fontSize: 14, color: "#666" }}>
          Mostrando <span style={{ fontWeight: 600, color: "#111" }}>{filteredClients.length}</span> de{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{clients.length}</span> clientes
        </p>
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, padding: 40 }}>
        {filteredClients.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              background: "#fff",
              borderRadius: 16,
              border: "2px dashed #e6eaf0",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#f6f7fa",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <FiUser size={32} color="#ccc" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
              No se encontraron clientes
            </h3>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
              {searchQuery || filterRubro !== "Todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza agregando tu primer cliente"}
            </p>
            {!searchQuery && filterRubro === "Todos" && (
              <button
                onClick={onAdd}
                style={{
                  padding: "12px 24px",
                  background: "#0049ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FiPlus size={18} />
                Agregar Cliente
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Vista de Grid
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: 24,
            }}
          >
            {filteredClients.map((client) => (
              <div
                key={client.id}
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  border: "1px solid #e6eaf0",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.borderColor = "#0049ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "#e6eaf0";
                }}
              >
                {/* Header de la tarjeta */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #0049ff 0%, #0066ff 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {client.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", marginBottom: 4, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
                        {client.nombre}
                      </h3>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          background: "#f6f7fa",
                          borderRadius: 6,
                          fontSize: 12,
                          color: "#666",
                        }}
                      >
                        <FiBriefcase size={12} />
                        {client.rubro}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(client);
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: "1px solid #e6eaf0",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f6f7fa";
                        e.currentTarget.style.borderColor = "#0049ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#e6eaf0";
                      }}
                    >
                      <FiEdit2 size={14} color="#666" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(client.id);
                      }}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: "1px solid #e6eaf0",
                        background: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fee";
                        e.currentTarget.style.borderColor = "#f44";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.borderColor = "#e6eaf0";
                      }}
                    >
                      <FiTrash2 size={14} color="#f44" />
                    </button>
                  </div>
                </div>

                {/* Información de contacto */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "#f6f7fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiMail size={16} color="#666" />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Email</p>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#111",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {client.email}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        background: "#f6f7fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiPhone size={16} color="#666" />
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Teléfono</p>
                      <p style={{ fontSize: 14, color: "#111" }}>{client.telefono}</p>
                    </div>
                  </div>

                  {client.direccion && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#f6f7fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiMapPin size={16} color="#666" />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Dirección</p>
                        <p
                          style={{
                            fontSize: 14,
                            color: "#111",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {client.direccion}
                        </p>
                      </div>
                    </div>
                  )}

                  {client.notas && (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 8 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#f6f7fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FiFileText size={16} color="#666" />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Notas</p>
                        <p
                          style={{
                            fontSize: 14,
                            color: "#666",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {client.notas}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Vista de Lista
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #e6eaf0" }}>
            {/* Header de la tabla */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr 1fr 1fr 0.8fr 100px",
                gap: 16,
                padding: "16px 24px",
                background: "#f6f7fa",
                borderBottom: "1px solid #e6eaf0",
                fontSize: 13,
                fontWeight: 600,
                color: "#666",
              }}
            >
              <div>CLIENTE</div>
              <div>EMAIL</div>
              <div>TELÉFONO</div>
              <div>DIRECCIÓN</div>
              <div>RUBRO</div>
              <div style={{ textAlign: "right" }}>ACCIONES</div>
            </div>

            {/* Filas de la tabla */}
            {filteredClients.map((client, index) => (
              <div
                key={client.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.2fr 1fr 1fr 0.8fr 100px",
                  gap: 16,
                  padding: "20px 24px",
                  borderBottom: index < filteredClients.length - 1 ? "1px solid #e6eaf0" : "none",
                  alignItems: "center",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fafbfc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {/* Cliente */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0049ff 0%, #0066ff 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    {client.nombre.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{client.nombre}</span>
                </div>

                {/* Email */}
                <span
                  style={{
                    fontSize: 14,
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {client.email}
                </span>

                {/* Teléfono */}
                <span style={{ fontSize: 14, color: "#666" }}>{client.telefono}</span>

                {/* Dirección */}
                <span
                  style={{
                    fontSize: 14,
                    color: "#666",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {client.direccion || "-"}
                </span>

                {/* Rubro */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "#f6f7fa",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "#666",
                    width: "fit-content",
                  }}
                >
                  <FiBriefcase size={12} />
                  {client.rubro}
                </div>

                {/* Acciones */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(client);
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #e6eaf0",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f6f7fa";
                      e.currentTarget.style.borderColor = "#0049ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#e6eaf0";
                    }}
                  >
                    <FiEdit2 size={14} color="#666" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(client.id);
                    }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: "1px solid #e6eaf0",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee";
                      e.currentTarget.style.borderColor = "#f44";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.borderColor = "#e6eaf0";
                    }}
                  >
                    <FiTrash2 size={14} color="#f44" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
