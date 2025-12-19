"use client";
import React, { useState, useMemo } from "react";
import { Project, Client } from "../../types";
import {
  FiSearch,
  FiFilter,
  FiFileText,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiSend,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiEye,
} from "react-icons/fi";

interface Budget {
  id: string;
  proyecto_id: string;
  numero: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  monto_total: number;
  estado: "Borrador" | "Enviado" | "Aprobado" | "Rechazado" | "Vencido";
  items: BudgetItem[];
  notas: string;
}

interface BudgetItem {
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface PresupuestosPageProps {
  projects: Project[];
  clients: Client[];
}

export default function PresupuestosPage({ projects, clients }: PresupuestosPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");

  // Mock data de presupuestos (luego se integrará con Supabase)
  const [budgets] = useState<Budget[]>([]);

  // Filtrar presupuestos
  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const project = projects.find((p) => p.id === budget.proyecto_id);
      const client = clients.find((c) => c.id === project?.cliente_id);

      const matchesSearch =
        budget.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.nombre.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "Todos" || budget.estado === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [budgets, searchQuery, filterStatus, projects, clients]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = budgets.length;
    const borradores = budgets.filter((b) => b.estado === "Borrador").length;
    const enviados = budgets.filter((b) => b.estado === "Enviado").length;
    const aprobados = budgets.filter((b) => b.estado === "Aprobado").length;
    const totalMonto = budgets.reduce((sum, b) => sum + b.monto_total, 0);

    return { total, borradores, enviados, aprobados, totalMonto };
  }, [budgets]);

  // Obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Borrador":
        return { bg: "rgba(107, 114, 128, 0.1)", color: "#6b7280" };
      case "Enviado":
        return { bg: "rgba(0, 73, 255, 0.1)", color: "#0049ff" };
      case "Aprobado":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "Rechazado":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" };
      case "Vencido":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" };
      default:
        return { bg: "#f6f7fa", color: "#666" };
    }
  };

  // Obtener icono según estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Borrador":
        return <FiEdit2 size={14} />;
      case "Enviado":
        return <FiSend size={14} />;
      case "Aprobado":
        return <FiCheckCircle size={14} />;
      case "Rechazado":
        return <FiXCircle size={14} />;
      case "Vencido":
        return <FiClock size={14} />;
      default:
        return null;
    }
  };

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 100px)",
        background: "#f6f7fa",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", marginBottom: 8 }}>
              Presupuestos
            </h1>
            <p style={{ fontSize: 15, color: "#666" }}>
              Crea y gestiona presupuestos para tus proyectos
            </p>
          </div>
          <button
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
            Nuevo Presupuesto
          </button>
        </div>

        {/* Estadísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginBottom: 24,
          }}
        >
          {/* Total */}
          <div
            style={{
              background: "rgba(0, 0, 0, 0.02)",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiFileText size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Total</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Borradores */}
          <div
            style={{
              background: "rgba(0, 0, 0, 0.02)",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiEdit2 size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Borradores</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.borradores}</p>
              </div>
            </div>
          </div>

          {/* Enviados */}
          <div
            style={{
              background: "rgba(0, 0, 0, 0.02)",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiSend size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Enviados</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.enviados}</p>
              </div>
            </div>
          </div>

          {/* Aprobados */}
          <div
            style={{
              background: "rgba(0, 0, 0, 0.02)",
              borderRadius: 12,
              padding: "20px 24px",
              border: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(0, 0, 0, 0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiCheckCircle size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Aprobados</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.aprobados}</p>
              </div>
            </div>
          </div>
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
              placeholder="Buscar por número, proyecto o cliente..."
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

          {/* Filtro por estado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
              minWidth: 180,
            }}
          >
            <FiFilter size={18} color="#666" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                cursor: "pointer",
              }}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Borrador">Borrador</option>
              <option value="Enviado">Enviado</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Rechazado">Rechazado</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div
        style={{
          padding: "16px 40px",
          background: "#fff",
          borderBottom: "1px solid #e6eaf0",
        }}
      >
        <p style={{ fontSize: 14, color: "#666" }}>
          Mostrando{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{filteredBudgets.length}</span> de{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{budgets.length}</span> presupuestos
        </p>
      </div>

      {/* Contenido */}
      <div style={{ padding: 40 }}>
        {filteredBudgets.length === 0 ? (
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
              <FiFileText size={32} color="#ccc" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8 }}>
              No hay presupuestos
            </h3>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
              {searchQuery || filterStatus !== "Todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando tu primer presupuesto"}
            </p>
            {!searchQuery && filterStatus === "Todos" && (
              <button
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
                Crear Presupuesto
              </button>
            )}
          </div>
        ) : (
          // Grid de presupuestos
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
              gap: 24,
            }}
          >
            {filteredBudgets.map((budget) => {
              const project = projects.find((p) => p.id === budget.proyecto_id);
              const client = clients.find((c) => c.id === project?.cliente_id);
              const estadoStyle = getEstadoColor(budget.estado);

              return (
                <div
                  key={budget.id}
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
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 16,
                      paddingBottom: 16,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "inline-flex",
                          padding: "4px 10px",
                          background: "#f6f7fa",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#666",
                          fontFamily: "monospace",
                          marginBottom: 8,
                        }}
                      >
                        #{budget.numero}
                      </div>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: "#111",
                        }}
                      >
                        {project?.nombre || "Proyecto desconocido"}
                      </h3>
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: estadoStyle.bg,
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        color: estadoStyle.color,
                      }}
                    >
                      {getEstadoIcon(budget.estado)}
                      {budget.estado}
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Cliente */}
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
                        <FiUser size={16} color="#666" />
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Cliente</p>
                        <p style={{ fontSize: 14, color: "#111", fontWeight: 600 }}>
                          {client?.nombre || "Cliente desconocido"}
                        </p>
                      </div>
                    </div>

                    {/* Fechas */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FiCalendar size={14} color="#666" />
                        <div>
                          <p style={{ fontSize: 11, color: "#999" }}>Emisión</p>
                          <p style={{ fontSize: 13, color: "#111" }}>
                            {formatDate(budget.fecha_emision)}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FiClock size={14} color="#666" />
                        <div>
                          <p style={{ fontSize: 11, color: "#999" }}>Vencimiento</p>
                          <p style={{ fontSize: 13, color: "#111" }}>
                            {formatDate(budget.fecha_vencimiento)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Items count */}
                    <div
                      style={{
                        padding: "12px",
                        background: "#f6f7fa",
                        borderRadius: 8,
                      }}
                    >
                      <p style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                        {budget.items.length} item{budget.items.length !== 1 ? "s" : ""}
                      </p>
                      <div style={{ fontSize: 11, color: "#666", maxHeight: 60, overflow: "hidden" }}>
                        {budget.items.slice(0, 2).map((item, idx) => (
                          <p key={idx} style={{ marginBottom: 2 }}>
                            • {item.descripcion}
                          </p>
                        ))}
                        {budget.items.length > 2 && (
                          <p style={{ color: "#999" }}>+ {budget.items.length - 2} más</p>
                        )}
                      </div>
                    </div>

                    {/* Monto Total */}
                    <div
                      style={{
                        padding: "16px",
                        background: "linear-gradient(135deg, #0049ff 0%, #0066ff 100%)",
                        borderRadius: 10,
                        textAlign: "center",
                      }}
                    >
                      <p style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.8)", marginBottom: 4 }}>
                        Monto Total
                      </p>
                      <p style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>
                        {formatCurrency(budget.monto_total)}
                      </p>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <button
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          background: "#fff",
                          color: "#666",
                          border: "1px solid #e6eaf0",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#0049ff";
                          e.currentTarget.style.color = "#0049ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#e6eaf0";
                          e.currentTarget.style.color = "#666";
                        }}
                      >
                        <FiEye size={16} />
                        Ver
                      </button>
                      <button
                        style={{
                          flex: 1,
                          padding: "10px 16px",
                          background: "#0049ff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                        <FiDownload size={16} />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
