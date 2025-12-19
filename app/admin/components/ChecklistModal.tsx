"use client";
import React, { useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { Project, Task } from "../types";

interface ChecklistModalProps {
  project: Project;
  onSave: (projectId: string, tasks: Task[]) => void;
  onClose: () => void;
}

export default function ChecklistModal({ project, onSave, onClose }: ChecklistModalProps) {
  const [tasks, setTasks] = useState<Task[]>(project.checklists || []);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState<Task>({ 
    nombre: "", 
    descripcion: "", 
    asignado: "Valentina",
    checked: false 
  });
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Task>({ 
    nombre: "", 
    descripcion: "", 
    asignado: "Valentina", 
    checked: false 
  });

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (taskForm.nombre && taskForm.descripcion && taskForm.asignado) {
      setTasks([...tasks, { ...taskForm, checked: false }]);
      setTaskForm({ nombre: "", descripcion: "", asignado: "Valentina", checked: false });
      setShowTaskForm(false);
    }
  }

  function handleDeleteTask(idx: number) {
    setTasks(tasks.filter((_, i) => i !== idx));
  }

  function handleCheckTask(idx: number) {
    setTasks(tasks.map((t, i) => (i === idx ? { ...t, checked: !t.checked } : t)));
  }

  function handleEditTask(idx: number) {
    setEditingIndex(idx);
    setEditFields({ ...tasks[idx] });
  }

  function handleEditFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setEditFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSaveEditTask(idx: number) {
    setTasks(tasks.map((t, i) => (i === idx ? { ...editFields } : t)));
    setEditingIndex(null);
  }

  function handleCancelEdit() {
    setEditingIndex(null);
  }

  async function handleSave() {
    setSaving(true);
    await onSave(project.id, tasks);
    setSaving(false);
  }

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
        zIndex: 1001,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          minWidth: 500,
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxShadow: "0 4px 32px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h3 style={{ color: "#111", fontWeight: 700, fontSize: 22, textAlign: "center" }}>
          Checklist: {project.nombre}
        </h3>

        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          style={{
            background: "#0049ff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 15,
            width: "fit-content",
          }}
        >
          {showTaskForm ? "Cancelar" : "+ Nueva Tarea"}
        </button>

        {showTaskForm && (
          <form
            onSubmit={handleAddTask}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: 20,
              background: "#f6f7fa",
              borderRadius: 8,
              border: "1px solid #e6eaf0",
            }}
          >
            <input
              placeholder="Nombre de la tarea"
              value={taskForm.nombre}
              onChange={(e) => setTaskForm((f) => ({ ...f, nombre: e.target.value }))}
              required
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 16,
                color: "#111",
              }}
            />
            <input
              placeholder="Descripción de la tarea"
              value={taskForm.descripcion}
              onChange={(e) => setTaskForm((f) => ({ ...f, descripcion: e.target.value }))}
              required
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 16,
                color: "#111",
              }}
            />
            <select
              value={taskForm.asignado}
              onChange={(e) => setTaskForm((f) => ({ ...f, asignado: e.target.value }))}
              required
              style={{
                padding: "10px 14px",
                borderRadius: 6,
                border: "1px solid #ccc",
                fontSize: 16,
                color: "#111",
              }}
            >
              <option value="Valentina">Valentina</option>
              <option value="Martin">Martin</option>
            </select>
            <button
              type="submit"
              style={{
                background: "#0049ff",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 15,
                width: "fit-content",
              }}
            >
              Agregar Tarea
            </button>
          </form>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tasks.length === 0 ? (
            <p style={{ color: "#888", textAlign: "center", padding: 20 }}>
              No hay tareas. Agrega una nueva tarea para comenzar.
            </p>
          ) : (
            tasks.map((t, i) => (
              <div
                key={i}
                style={{
                  padding: 16,
                  background: "#f6f7fa",
                  borderRadius: 8,
                  border: "1px solid #e6eaf0",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                {editingIndex === i ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      name="nombre"
                      value={editFields.nombre}
                      onChange={handleEditFieldChange}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #bbb",
                        fontSize: 15,
                        color: "#111",
                        fontWeight: 600,
                      }}
                    />
                    <input
                      name="descripcion"
                      value={editFields.descripcion}
                      onChange={handleEditFieldChange}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #bbb",
                        fontSize: 14,
                        color: "#111",
                      }}
                    />
                    <select
                      name="asignado"
                      value={editFields.asignado}
                      onChange={handleEditFieldChange}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        border: "1px solid #bbb",
                        fontSize: 14,
                        color: "#111",
                      }}
                    >
                      <option value="Valentina">Valentina</option>
                      <option value="Martin">Martin</option>
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "#111" }}>
                      <input
                        type="checkbox"
                        name="checked"
                        checked={editFields.checked}
                        onChange={handleEditFieldChange}
                      />
                      Tarea completada
                    </label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleSaveEditTask(i)}
                        style={{
                          background: "#0049ff",
                          color: "#fff",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 16px",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          background: "#eee",
                          color: "#111",
                          border: "none",
                          borderRadius: 6,
                          padding: "6px 16px",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: 14,
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckTask(i)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        border: "2px solid #0049ff",
                        background: t.checked ? "#0049ff" : "#fff",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {t.checked ? "✓" : ""}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: "#111",
                          fontWeight: 600,
                          fontSize: 16,
                          marginBottom: 4,
                          textDecoration: t.checked ? "line-through" : "none",
                        }}
                      >
                        {t.nombre}
                      </div>
                      <div style={{ color: "#666", fontSize: 14, marginBottom: 6 }}>{t.descripcion}</div>
                      <div style={{ color: "#0049ff", fontSize: 13, fontWeight: 500 }}>
                        Asignado a: {t.asignado}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        type="button"
                        onClick={() => handleEditTask(i)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        title="Editar tarea"
                      >
                        <FiEdit2 size={18} color="#0049ff" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTask(i)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                        }}
                        title="Eliminar tarea"
                      >
                        <FiTrash2 size={18} color="#ff3b3b" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              background: "#eee",
              color: "#111",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 500,
              fontSize: 16,
              opacity: saving ? 0.6 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: "#0049ff",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 16,
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
