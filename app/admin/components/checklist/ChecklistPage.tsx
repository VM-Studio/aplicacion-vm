"use client";
import React, { useState, useMemo } from "react";
import { Project, Client, Task } from "../../types";
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiUser,
  FiFolder,
  FiList,
  FiGrid,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

interface TaskWithProject extends Task {
  projectId: string;
  projectName: string;
  projectCode: string;
  clientName: string;
}

interface ChecklistPageProps {
  projects: Project[];
  clients: Client[];
  onUpdateTask?: (projectId: string, taskIndex: number, updatedTask: Task) => void;
  onDeleteTask?: (projectId: string, taskIndex: number) => void;
}

export default function ChecklistPage({
  projects,
  clients,
  onUpdateTask,
}: ChecklistPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState<string>("Todos");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Obtener todas las tareas con información del proyecto
  const allTasks: TaskWithProject[] = useMemo(() => {
    const tasks: TaskWithProject[] = [];
    projects.forEach((project) => {
      const client = clients.find((c) => c.id === project.cliente_id);
      if (project.checklists && project.checklists.length > 0) {
        project.checklists.forEach((task) => {
          tasks.push({
            ...task,
            projectId: project.id,
            projectName: project.nombre,
            projectCode: project.codigo,
            clientName: client?.nombre || "Sin cliente",
          });
        });
      }
    });
    return tasks;
  }, [projects, clients]);

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const matchesSearch =
        task.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.asignado.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.projectName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesProject =
        filterProject === "Todos" || task.projectName === filterProject;

      const matchesStatus =
        filterStatus === "Todos" ||
        (filterStatus === "Completadas" && task.checked) ||
        (filterStatus === "Pendientes" && !task.checked);

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [allTasks, searchQuery, filterProject, filterStatus]);

  // Estadísticas
  const stats = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter((t) => t.checked).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [allTasks]);

  // Obtener proyectos únicos
  const uniqueProjects = useMemo(() => {
    return ["Todos", ...Array.from(new Set(projects.map((p) => p.nombre)))];
  }, [projects]);

  // Toggle task completion
  const handleToggleTask = (task: TaskWithProject, taskIndex: number) => {
    if (onUpdateTask) {
      const updatedTask = { ...task, checked: !task.checked };
      onUpdateTask(task.projectId, taskIndex, updatedTask);
    }
  };

  // Obtener color según estado
  const getStatusColor = (checked: boolean) => {
    return checked ? "#10b981" : "#f59e0b";
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
              Checklist Global
            </h1>
            <p style={{ fontSize: 15, color: "#666" }}>
              Visualiza y gestiona todas las tareas de tus proyectos
            </p>
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
                <FiList size={20} color="#666" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Total Tareas</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Completadas */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Completadas</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.completed}</p>
              </div>
            </div>
          </div>

          {/* Pendientes */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Pendientes</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.pending}</p>
              </div>
            </div>
          </div>

          {/* Progreso */}
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
                <p style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>Progreso Total</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: "#111" }}>{stats.completionRate}%</p>
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
              placeholder="Buscar por tarea, descripción, asignado o proyecto..."
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
            <FiFolder size={18} color="#666" />
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
              <option value="Pendientes">Pendientes</option>
              <option value="Completadas">Completadas</option>
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
          <span style={{ fontWeight: 600, color: "#111" }}>{filteredTasks.length}</span> de{" "}
          <span style={{ fontWeight: 600, color: "#111" }}>{allTasks.length}</span> tareas
        </p>
      </div>

      {/* Contenido */}
      <div style={{ padding: 40 }}>
        {filteredTasks.length === 0 ? (
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
              <FiList size={32} color="#ccc" />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", marginBottom: 8, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
              No se encontraron tareas
            </h3>
            <p style={{ fontSize: 15, color: "#666" }}>
              {searchQuery || filterProject !== "Todos" || filterStatus !== "Todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Los proyectos aún no tienen tareas asignadas"}
            </p>
          </div>
        ) : viewMode === "list" ? (
          // Vista de Lista
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
                gridTemplateColumns: "50px 2fr 1.5fr 1fr 1fr 120px 80px",
                gap: 16,
                padding: "16px 24px",
                background: "#f6f7fa",
                borderBottom: "1px solid #e6eaf0",
                fontSize: 13,
                fontWeight: 600,
                color: "#666",
              }}
            >
              <div>✓</div>
              <div>TAREA</div>
              <div>PROYECTO</div>
              <div>CLIENTE</div>
              <div>ASIGNADO</div>
              <div>CÓDIGO</div>
              <div style={{ textAlign: "center" }}>ESTADO</div>
            </div>

            {/* Filas de la tabla */}
            {filteredTasks.map((task, index) => {
              const project = projects.find((p) => p.id === task.projectId);
              const taskIndex = project?.checklists.findIndex(
                (t) => t.nombre === task.nombre && t.descripcion === task.descripcion
              ) ?? -1;

              return (
                <div
                  key={`${task.projectId}-${index}`}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "50px 2fr 1.5fr 1fr 1fr 120px 80px",
                    gap: 16,
                    padding: "20px 24px",
                    borderBottom:
                      index < filteredTasks.length - 1 ? "1px solid #e6eaf0" : "none",
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
                  {/* Checkbox */}
                  <div>
                    <button
                      onClick={() => handleToggleTask(task, taskIndex)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        border: task.checked ? "none" : "2px solid #ccc",
                        background: task.checked ? "#10b981" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      {task.checked && <FiCheckCircle size={16} color="#fff" />}
                    </button>
                  </div>

                  {/* Tarea */}
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: task.checked ? "#999" : "#111",
                        textDecoration: task.checked ? "line-through" : "none",
                        marginBottom: 4,
                      }}
                    >
                      {task.nombre}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#666",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {task.descripcion}
                    </div>
                  </div>

                  {/* Proyecto */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: "#0049ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {task.projectName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: 14, color: "#111" }}>{task.projectName}</span>
                  </div>

                  {/* Cliente */}
                  <span style={{ fontSize: 14, color: "#666" }}>{task.clientName}</span>

                  {/* Asignado */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#f6f7fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiUser size={14} color="#666" />
                    </div>
                    <span style={{ fontSize: 14, color: "#666" }}>{task.asignado}</span>
                  </div>

                  {/* Código */}
                  <div
                    style={{
                      display: "inline-flex",
                      padding: "6px 12px",
                      background: "#f6f7fa",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#666",
                      fontFamily: "monospace",
                    }}
                  >
                    {task.projectCode}
                  </div>

                  {/* Estado */}
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: task.checked
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        color: getStatusColor(task.checked),
                      }}
                    >
                      {task.checked ? (
                        <>
                          <FiCheckCircle size={12} />
                          Hecha
                        </>
                      ) : (
                        <>
                          <FiClock size={12} />
                          Pendiente
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vista de Grid
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: 24,
            }}
          >
            {filteredTasks.map((task, index) => {
              const project = projects.find((p) => p.id === task.projectId);
              const taskIndex = project?.checklists.findIndex(
                (t) => t.nombre === task.nombre && t.descripcion === task.descripcion
              ) ?? -1;

              return (
                <div
                  key={`${task.projectId}-${index}`}
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
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "inline-flex",
                          padding: "6px 12px",
                          background: "#f6f7fa",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#666",
                          fontFamily: "monospace",
                          marginBottom: 12,
                        }}
                      >
                        {task.projectCode}
                      </div>
                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: task.checked ? "#999" : "#111",
                          textDecoration: task.checked ? "line-through" : "none",
                          marginBottom: 8,
                          fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {task.nombre}
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          color: "#666",
                          lineHeight: 1.6,
                          marginBottom: 16,
                        }}
                      >
                        {task.descripcion}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleTask(task, taskIndex)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        border: task.checked ? "none" : "2px solid #ccc",
                        background: task.checked ? "#10b981" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                        flexShrink: 0,
                        marginLeft: 12,
                      }}
                    >
                      {task.checked && <FiCheckCircle size={18} color="#fff" />}
                    </button>
                  </div>

                  {/* Info */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Proyecto */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "#0049ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {task.projectName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#999", marginBottom: 2 }}>Proyecto</p>
                        <p style={{ fontSize: 14, color: "#111", fontWeight: 600 }}>
                          {task.projectName}
                        </p>
                      </div>
                    </div>

                    {/* Cliente y Asignado */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
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
                          <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>Cliente</p>
                          <p style={{ fontSize: 13, color: "#111" }}>{task.clientName}</p>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
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
                          <p style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>Asignado</p>
                          <p style={{ fontSize: 13, color: "#111" }}>{task.asignado}</p>
                        </div>
                      </div>
                    </div>

                    {/* Estado */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        padding: "10px 16px",
                        background: task.checked
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(245, 158, 11, 0.1)",
                        borderRadius: 10,
                        fontSize: 14,
                        fontWeight: 600,
                        color: getStatusColor(task.checked),
                        marginTop: 8,
                      }}
                    >
                      {task.checked ? (
                        <>
                          <FiCheckCircle size={16} />
                          Tarea Completada
                        </>
                      ) : (
                        <>
                          <FiClock size={16} />
                          Tarea Pendiente
                        </>
                      )}
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
