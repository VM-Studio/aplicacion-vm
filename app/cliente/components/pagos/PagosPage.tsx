"use client";

import { FiDollarSign, FiCalendar, FiCreditCard } from "react-icons/fi";

interface Payment {
  id: string;
  proyecto_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: "Pagado" | "Pendiente" | "Vencido";
  descripcion: string;
}

export default function PagosPage({ 
  pagos, 
  formatCurrency, 
  handlePagar 
}: {
  pagos: Payment[];
  formatCurrency: (amount: number) => string;
  handlePagar: (pago: Payment) => void;
}) {
  // Calcular totales
  const totalPagado = pagos
    .filter(p => p.estado === "Pagado")
    .reduce((sum, p) => sum + p.monto, 0);
  
  const totalPendiente = pagos
    .filter(p => p.estado === "Pendiente" || p.estado === "Vencido")
    .reduce((sum, p) => sum + p.monto, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header con estadísticas */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "24px 28px",
          border: "1px solid #e6eaf0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                color: "#111",
                fontWeight: 700,
                fontSize: 20,
                margin: 0,
                marginBottom: 4,
                letterSpacing: "-0.3px",
              }}
            >
              Historial de Pagos
            </h2>
            <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
              Gestiona tus pagos y facturas
            </p>
          </div>
        </div>

        {/* Estadísticas */}
        {pagos.length > 0 && (
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                flex: 1,
                background: "rgba(16, 185, 129, 0.06)",
                borderRadius: 12,
                padding: "16px 20px",
                border: "1px solid rgba(16, 185, 129, 0.15)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(16, 185, 129, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiDollarSign size={20} color="#10b981" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>
                    Total Pagado
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#10b981",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {formatCurrency(totalPagado)}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(0, 73, 255, 0.04)",
                borderRadius: 12,
                padding: "16px 20px",
                border: "1px solid rgba(0, 73, 255, 0.1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: "rgba(0, 73, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiCreditCard size={20} color="#0049ff" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 2 }}>
                    Pendiente
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: "#0049ff",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {formatCurrency(totalPendiente)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de pagos */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e6eaf0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
          overflow: "hidden",
        }}
      >
        {pagos.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
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
              <FiDollarSign size={36} color="rgba(0, 73, 255, 0.4)" strokeWidth={2} />
            </div>
            <p style={{ color: "#111", fontSize: 16, fontWeight: 600, margin: 0, marginBottom: 6 }}>
              No hay pagos registrados
            </p>
            <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
              Los pagos aparecerán aquí cuando se registren
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "rgba(0, 73, 255, 0.04)" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 13,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    Fecha
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 13,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    Descripción
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "14px 20px",
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 13,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    Método
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "14px 20px",
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 13,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    Monto
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "14px 20px",
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 13,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    Estado
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "14px 20px",
                      fontWeight: 600,
                      color: "#111",
                      fontSize: 13,
                      borderBottom: "1px solid #e6eaf0",
                    }}
                  >
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagos.map((p, index) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: index !== pagos.length - 1 ? "1px solid #f1f3f5" : "none",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(0, 73, 255, 0.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <FiCalendar size={14} color="#999" />
                        <span style={{ color: "#666", fontSize: 14 }}>
                          {new Date(p.fecha_pago).toLocaleDateString("es-AR")}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "18px 20px", color: "#111", fontSize: 14, fontWeight: 500 }}>
                      {p.descripcion}
                    </td>
                    <td style={{ padding: "18px 20px" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          background: "#f8fafc",
                          borderRadius: 6,
                          fontSize: 13,
                          color: "#666",
                        }}
                      >
                        <FiCreditCard size={13} />
                        {p.metodo_pago}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "18px 20px",
                        textAlign: "right",
                        color: "#0049ff",
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {formatCurrency(p.monto)}
                    </td>
                    <td style={{ padding: "18px 20px", textAlign: "center" }}>
                      <span
                        style={{
                          background:
                            p.estado === "Pagado"
                              ? "rgba(16, 185, 129, 0.1)"
                              : p.estado === "Pendiente"
                              ? "rgba(255, 179, 0, 0.1)"
                              : "rgba(239, 68, 68, 0.1)",
                          color:
                            p.estado === "Pagado"
                              ? "#10b981"
                              : p.estado === "Pendiente"
                              ? "#ff8800"
                              : "#ef4444",
                          borderRadius: 8,
                          padding: "6px 12px",
                          fontWeight: 600,
                          fontSize: 12,
                          display: "inline-block",
                          border:
                            p.estado === "Pagado"
                              ? "1px solid rgba(16, 185, 129, 0.2)"
                              : p.estado === "Pendiente"
                              ? "1px solid rgba(255, 179, 0, 0.2)"
                              : "1px solid rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        {p.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "center", padding: "18px 20px" }}>
                      {p.estado === "Pendiente" && (
                        <button
                          onClick={() => handlePagar(p)}
                          style={{
                            background: "rgba(0, 73, 255, 0.95)",
                            color: "#fff",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 18px",
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#0049ff";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(0, 73, 255, 0.95)";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          Pagar ahora
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
