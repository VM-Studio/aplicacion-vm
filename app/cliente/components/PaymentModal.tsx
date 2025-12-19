"use client";

interface Payment {
  id: string;
  proyecto_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: "Pagado" | "Pendiente" | "Vencido";
  descripcion: string;
}

export default function PaymentModal({
  pago,
  formatCurrency,
  onClose,
}: {
  pago: Payment;
  formatCurrency: (amount: number) => string;
  onClose: () => void;
}) {
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
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          minWidth: 400,
          maxWidth: 500,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3
          style={{
            color: "#111",
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 20,
          }}
        >
          Métodos de pago
        </h3>
        <div style={{ marginBottom: 24 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Descripción:</strong> {pago.descripcion}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#0049ff" }}>
            <strong>Monto:</strong> {formatCurrency(pago.monto)}
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <p style={{ marginBottom: 12, fontWeight: 600 }}>
            Selecciona una forma de pago:
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              disabled
              style={{
                background: "#f6f7fa",
                color: "#999",
                border: "1px solid #e6eaf0",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "not-allowed",
                width: "100%",
              }}
            >
              Tarjeta de débito (Próximamente)
            </button>
            <button
              disabled
              style={{
                background: "#f6f7fa",
                color: "#999",
                border: "1px solid #e6eaf0",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "not-allowed",
                width: "100%",
              }}
            >
              Tarjeta de crédito (Próximamente)
            </button>
            <button
              disabled
              style={{
                background: "#f6f7fa",
                color: "#999",
                border: "1px solid #e6eaf0",
                borderRadius: 8,
                padding: "12px 20px",
                fontWeight: 600,
                fontSize: 15,
                cursor: "not-allowed",
                width: "100%",
              }}
            >
              Mercado Pago (Próximamente)
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            background: "#0049ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 20px",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            width: "100%",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0041dd";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0049ff";
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
