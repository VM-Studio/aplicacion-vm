"use client";
import React from "react";

export interface PaymentForm {
  id: string;
  proyecto_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: "Pagado" | "Pendiente" | "Vencido";
  descripcion: string;
}

interface PaymentModalProps {
  paymentForm: PaymentForm;
  projects: { id: string; nombre: string; codigo: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export default function PaymentModal({
  paymentForm,
  projects,
  onChange,
  onSubmit,
  onClose,
}: PaymentModalProps) {
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
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 550,
          maxWidth: 650,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3
          style={{
            color: "#111",
            fontWeight: 700,
            fontSize: 22,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          {paymentForm.id ? "Editar Pago" : "Registrar Nuevo Pago"}
        </h3>

        {/* Proyecto */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Proyecto *
          <select
            name="proyecto_id"
            value={paymentForm.proyecto_id}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              cursor: "pointer",
            }}
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.nombre} ({project.codigo})
              </option>
            ))}
          </select>
        </label>

        {/* Monto */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Monto *
          <input
            name="monto"
            type="number"
            step="0.01"
            min="0"
            placeholder="Ej: 50000"
            value={paymentForm.monto || ""}
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

        {/* Fecha de Pago */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Fecha de Pago *
          <input
            name="fecha_pago"
            type="date"
            value={paymentForm.fecha_pago}
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

        {/* Método de Pago */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Método de Pago *
          <select
            name="metodo_pago"
            value={paymentForm.metodo_pago}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              cursor: "pointer",
            }}
          >
            <option value="">Selecciona un método</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Cheque">Cheque</option>
            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
            <option value="MercadoPago">MercadoPago</option>
            <option value="Otro">Otro</option>
          </select>
        </label>

        {/* Estado */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Estado *
          <select
            name="estado"
            value={paymentForm.estado}
            onChange={onChange}
            required
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
              color: "#111",
              cursor: "pointer",
            }}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Vencido">Vencido</option>
          </select>
        </label>

        {/* Descripción */}
        <label
          style={{
            color: "#111",
            fontWeight: 500,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          Descripción
          <textarea
            name="descripcion"
            placeholder="Detalles del pago, concepto, observaciones..."
            value={paymentForm.descripcion}
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

        {/* Botones */}
        <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 24px",
              background: "#fff",
              color: "#666",
              border: "1px solid #ccc",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f6f7fa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              padding: "10px 24px",
              background: "#0049ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#0041dd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0049ff";
            }}
          >
            {paymentForm.id ? "Actualizar Pago" : "Registrar Pago"}
          </button>
        </div>
      </form>
    </div>
  );
}
