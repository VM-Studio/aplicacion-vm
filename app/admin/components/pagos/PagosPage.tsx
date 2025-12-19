"use client";
import React, { useState, useMemo } from "react";
import { Project, Client } from "../../types";
import {
  FiSearch,
  FiFilter,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
  FiDownload,
  FiPlus,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

interface Payment {
  id: string;
  proyecto_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: "Pagado" | "Pendiente" | "Vencido";
  descripcion: string;
}

interface PagosPageProps {
  projects: Project[];
  clients: Client[];
  onAddPayment?: () => void;
  onEditPayment?: (payment: Payment) => void;
  onDeletePayment?: (paymentId: string) => void;
  payments: Payment[];
}

export default function PagosPage({
  projects,
  clients,
  onAddPayment,
  onEditPayment,
  onDeletePayment,
  payments,
}: PagosPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [filterProject, setFilterProject] = useState<string>("Todos");

  // Obtener nombres de proyectos únicos
  const uniqueProjects = useMemo(() => {
    return ["Todos", ...projects.map((p) => p.nombre)];
  }, [projects]);

  // Filtrar pagos
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const project = projects.find((p) => p.id === payment.proyecto_id);
      const client = clients.find((c) => c.id === project?.cliente_id);

      const matchesSearch =
        project?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "Todos" || payment.estado === filterStatus;
      const matchesProject =
        filterProject === "Todos" || project?.nombre === filterProject;

      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [payments, searchQuery, filterStatus, filterProject, projects, clients]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.monto, 0);
    const pagado = payments
      .filter((p) => p.estado === "Pagado")
      .reduce((sum, p) => sum + p.monto, 0);
    const pendiente = payments
      .filter((p) => p.estado === "Pendiente")
      .reduce((sum, p) => sum + p.monto, 0);
    const vencido = payments
      .filter((p) => p.estado === "Vencido")
      .reduce((sum, p) => sum + p.monto, 0);

    return { total, pagado, pendiente, vencido };
  }, [payments]);

  // Obtener color según estado
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pagado":
        return { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981" };
      case "Pendiente":
        return { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" };
      case "Vencido":
        return { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444" };
      default:
        return { bg: "#f6f7fa", color: "#666" };
    }
  };

  // Obtener icono según estado
  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Pagado":
        return <FiCheckCircle size={14} />;
      case "Pendiente":
        return <FiClock size={14} />;
      case "Vencido":
        return <FiAlertCircle size={14} />;
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
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
              Gestión de Pagos
            </h1>
            <p style={{ fontSize: 15, color: "#666" }}>
              Control financiero y seguimiento de cobros
            </p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => {
                // Exportar a CSV
                const csvContent =
                  "data:text/csv;charset=utf-8," +
                  "Proyecto,Cliente,Monto,Fecha,Método,Estado,Descripción\n" +
                  payments
                    .map((p) => {
                      const project = projects.find((pr) => pr.id === p.proyecto_id);
                      const client = clients.find((c) => c.id === project?.cliente_id);
                      return `"${project?.nombre || ""}","${client?.nombre || ""}","${p.monto}","${p.fecha_pago}","${p.metodo_pago}","${p.estado}","${p.descripcion}"`;
                    })
                    .join("\n");
                const link = document.createElement("a");
                link.href = encodeURI(csvContent);
                link.download = `pagos_${new Date().toISOString().split("T")[0]}.csv`;
                link.click();
              }}
              style={{
                padding: "12px 24px",
                background: "#fff",
                color: "#666",
                border: "1px solid #e6eaf0",
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
                e.currentTarget.style.borderColor = "#0049ff";
                e.currentTarget.style.color = "#0049ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e6eaf0";
                e.currentTarget.style.color = "#666";
              }}
            >
              <FiDownload size={18} />
              Exportar
            </button>
            <button
              onClick={onAddPayment}
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
              Nuevo Pago
            </button>
          </div>
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
                <FiTrendingUp size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Total Facturado</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>{formatCurrency(stats.total)}</p>
              </div>
            </div>
          </div>

          {/* Pagado */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Cobrado</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>{formatCurrency(stats.pagado)}</p>
              </div>
            </div>
          </div>

          {/* Pendiente */}
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
                <FiClock size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Pendiente</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>
                  {formatCurrency(stats.pendiente)}
                </p>
              </div>
            </div>
          </div>

          {/* Vencido */}
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
                <FiAlertCircle size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Vencido</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#111" }}>{formatCurrency(stats.vencido)}</p>
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
              placeholder="Buscar por proyecto, cliente o descripción..."
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
              <option value="Pagado">Pagado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>

          {/* Filtro por proyecto */}
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
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: 15,
                color: "#111",
                cursor: "pointer",
              }}
            >
              {uniqueProjects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
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
          <span style={{ fontWeight: 600, color: "#111" }}>{filteredPayments.length}</span> de{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{payments.length}</span> pagos
        </p>
      </div>

      {/* Contenido */}
      <div style={{ padding: 40 }}>
        {filteredPayments.length === 0 ? (
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
              <FiDollarSign size={32} color="#ccc" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
              No hay pagos registrados
            </h3>
            <p style={{ fontSize: 15, color: "#666", marginBottom: 24 }}>
              {searchQuery || filterStatus !== "Todos" || filterProject !== "Todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza registrando el primer pago"}
            </p>
            {!searchQuery && filterStatus === "Todos" && filterProject === "Todos" && (
              <button
                onClick={onAddPayment}
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
                Registrar Pago
              </button>
            )}
          </div>
        ) : (
          // Tabla de pagos
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #e6eaf0",
            }}
          >
            {/* Header de la tabla */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr 1fr 120px 100px",
                gap: 16,
                padding: "16px 24px",
                background: "#f6f7fa",
                borderBottom: "1px solid #e6eaf0",
                fontSize: 13,
                fontWeight: 600,
                color: "#666",
              }}
            >
              <div>PROYECTO / CLIENTE</div>
              <div>MONTO</div>
              <div>FECHA PAGO</div>
              <div>MÉTODO</div>
              <div>DESCRIPCIÓN</div>
              <div style={{ textAlign: "center" }}>ESTADO</div>
              <div style={{ textAlign: "center" }}>ACCIONES</div>
            </div>

            {/* Filas de la tabla */}
            {filteredPayments.map((payment, index) => {
              const project = projects.find((p) => p.id === payment.proyecto_id);
              const client = clients.find((c) => c.id === project?.cliente_id);
              const estadoStyle = getEstadoColor(payment.estado);

              return (
                <div
                  key={payment.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.5fr 1fr 1fr 1.2fr 1fr 120px 100px",
                    gap: 16,
                    padding: "20px 24px",
                    borderBottom:
                      index < filteredPayments.length - 1 ? "1px solid #e6eaf0" : "none",
                    alignItems: "center",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#fafbfc";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {/* Proyecto / Cliente */}
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#111",
                        marginBottom: 4,
                      }}
                    >
                      {project?.nombre || "Proyecto desconocido"}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <FiUser size={12} color="#666" />
                      <span style={{ fontSize: 13, color: "#666" }}>
                        {client?.nombre || "Cliente desconocido"}
                      </span>
                    </div>
                  </div>

                  {/* Monto */}
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#10b981",
                    }}
                  >
                    {formatCurrency(payment.monto)}
                  </div>

                  {/* Fecha */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiCalendar size={14} color="#666" />
                    <span style={{ fontSize: 14, color: "#666" }}>
                      {formatDate(payment.fecha_pago)}
                    </span>
                  </div>

                  {/* Método */}
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "6px 12px",
                      background: "#f6f7fa",
                      borderRadius: 6,
                      fontSize: 13,
                      color: "#666",
                      width: "fit-content",
                    }}
                  >
                    {payment.metodo_pago}
                  </div>

                  {/* Descripción */}
                  <span
                    style={{
                      fontSize: 14,
                      color: "#666",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {payment.descripcion}
                  </span>

                  {/* Estado */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: estadoStyle.bg,
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: estadoStyle.color,
                      }}
                    >
                      {getEstadoIcon(payment.estado)}
                      {payment.estado}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditPayment?.(payment);
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
                        if (confirm("¿Estás seguro de eliminar este pago?")) {
                          onDeletePayment?.(payment.id);
                        }
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
