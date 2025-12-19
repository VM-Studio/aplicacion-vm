"use client";
import { FiCheckCircle, FiCircle } from "react-icons/fi";

interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_estimada: string;
  avance: number;
  checklists: Task[];
  url_proyecto?: string;
  codigo?: string;
}

interface Task {
  nombre: string;
  descripcion: string;
  checked: boolean;
  asignado?: string;
}

export default function ChecklistPage({ proyecto }: { proyecto: Project | null }) {
  const totalTasks = proyecto?.checklists?.length || 0;
  const completedTasks = proyecto?.checklists?.filter(task => task.checked).length || 0;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header con estadísticas */}
      <div
        style={{
          background: "linear-gradient(135deg, #f6f7fa 0%, #ffffff 100%)",
          borderRadius: 20,
          padding: 32,
          border: "1px solid #e6eaf0",
          marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ color: "#111", fontWeight: 800, fontSize: 28, margin: 0, marginBottom: 8 }}>
              Checklist del Proyecto
            </h3>
            <p style={{ color: "#666", fontSize: 15, margin: 0 }}>
              Seguimiento de tareas y progreso del desarrollo
            </p>
          </div>
          <div
            style={{
              background: completedTasks === totalTasks && totalTasks > 0 
                ? "rgba(16, 185, 129, 0.15)" 
                : "rgba(0, 73, 255, 0.1)",
              color: completedTasks === totalTasks && totalTasks > 0 ? "#10b981" : "#0049ff",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              border: completedTasks === totalTasks && totalTasks > 0 
                ? "1px solid rgba(16, 185, 129, 0.3)" 
                : "1px solid rgba(0, 73, 255, 0.2)",
            }}
          >
            {completedTasks}/{totalTasks} completadas
          </div>
        </div>

        {/* Barra de progreso mejorada */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#666" }}>Progreso general</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#0049ff" }}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div
            style={{
              background: "#e6eaf0",
              borderRadius: 12,
              height: 16,
              width: "100%",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                background: completedTasks === totalTasks && totalTasks > 0 
                  ? "linear-gradient(90deg, #10b981 0%, #059669 100%)"
                  : "linear-gradient(90deg, #0049ff 0%, #0066ff 100%)",
                width: `${progressPercentage}%`,
                height: "100%",
                borderRadius: 12,
                transition: "width 0.5s ease",
                boxShadow: progressPercentage > 0 ? "0 2px 8px rgba(0, 73, 255, 0.3)" : "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Lista de tareas */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          border: "1px solid #e6eaf0",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        }}
      >
        {Array.isArray(proyecto?.checklists) && proyecto.checklists.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {proyecto.checklists.map((task: Task, i: number) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 20,
                  padding: 24,
                  background: task.checked 
                    ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" 
                    : "#ffffff",
                  borderRadius: 16,
                  border: task.checked ? "2px solid #0ea5e9" : "1px solid #e6eaf0",
                  boxShadow: task.checked 
                    ? "0 4px 12px rgba(14, 165, 233, 0.15)" 
                    : "0 2px 8px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Indicador de estado visual */}
                {task.checked && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: 5,
                      height: "100%",
                      background: "linear-gradient(180deg, #0ea5e9 0%, #0284c7 100%)",
                    }}
                  />
                )}

                {/* Ícono de check mejorado */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: task.checked 
                      ? "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" 
                      : "#f6f7fa",
                    border: task.checked ? "none" : "2px solid #e6eaf0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s ease",
                    boxShadow: task.checked ? "0 4px 12px rgba(14, 165, 233, 0.3)" : "none",
                  }}
                >
                  {task.checked ? (
                    <FiCheckCircle size={22} color="#fff" strokeWidth={2.5} />
                  ) : (
                    <FiCircle size={22} color="#94a3b8" strokeWidth={2} />
                  )}
                </div>

                {/* Contenido de la tarea */}
                <div style={{ flex: 1, paddingLeft: 4 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 17,
                      color: task.checked ? "#0284c7" : "#111",
                      marginBottom: 8,
                      lineHeight: 1.4,
                    }}
                  >
                    {task.nombre}
                  </div>
                  <div 
                    style={{ 
                      fontSize: 15, 
                      color: "#64748b", 
                      marginBottom: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    {task.descripcion}
                  </div>
                  
                  {/* Badge del asignado */}
                  {task.asignado && (
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px",
                        background: task.checked ? "#fff" : "#f8fafc",
                        borderRadius: 10,
                        fontSize: 14,
                        color: "#0284c7",
                        fontWeight: 600,
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {task.asignado.charAt(0).toUpperCase()}
                      </div>
                      <span>{task.asignado}</span>
                    </div>
                  )}
                </div>

                {/* Badge de estado */}
                {task.checked && (
                  <div
                    style={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    ✓ Completada
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#f8fafc",
              borderRadius: 16,
              border: "2px dashed #e2e8f0",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <FiCircle size={40} color="#94a3b8" strokeWidth={2} />
            </div>
            <p style={{ color: "#64748b", fontSize: 16, fontWeight: 500, margin: 0 }}>
              No hay tareas en el checklist aún
            </p>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: "8px 0 0" }}>
              Las tareas aparecerán aquí cuando se agreguen al proyecto
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
