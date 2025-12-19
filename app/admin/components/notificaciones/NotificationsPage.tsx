"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Client, Project } from "../../types";
import { FiSend, FiSearch, FiUser, FiCheckCircle, FiCircle } from "react-icons/fi";
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string;
  project_id: string;
  sender: "client" | "admin";
  text: string;
  timestamp: string;
  read: boolean;
}

interface ProjectWithClient extends Project {
  client_nombre?: string;
}

interface NotificationsPageProps {
  clients: Client[];
}

export default function NotificationsPage({ clients }: NotificationsPageProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectWithClient | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [projects, setProjects] = useState<ProjectWithClient[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Cargar todos los proyectos
  const loadProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && !error) {
      // Agregar nombre del cliente a cada proyecto
      const projectsWithClients = data.map((project) => {
        const client = clients.find((c) => c.id === project.cliente_id);
        return {
          ...project,
          client_nombre: client?.nombre || "Cliente desconocido",
        };
      });
      setProjects(projectsWithClients);
    }
  };

  // Cargar todos los mensajes (para contar no leídos)
  const loadAllMessages = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("timestamp", { ascending: true });

    if (data && !error) {
      setMessages(data as Message[]);
    }
  };

  // Cargar mensajes de un proyecto específico
  const loadMessagesForProject = useCallback(async (projectId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("project_id", projectId)
      .order("timestamp", { ascending: true });

    if (data && !error) {
      setMessages(data as Message[]);
    }
  }, []);

  // Cargar proyectos al montar
  useEffect(() => {
    loadProjects();
    loadAllMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recargar mensajes cuando cambia el proyecto seleccionado
  useEffect(() => {
    if (selectedProject) {
      loadMessagesForProject(selectedProject.id);
    }
  }, [selectedProject, loadMessagesForProject]);

  // Marcar mensajes del cliente como leídos cuando el admin abre el chat
  useEffect(() => {
    if (selectedProject && messages.some((m) => m.project_id === selectedProject.id && m.sender === "client" && !m.read)) {
      const unreadIds = messages
        .filter((m) => m.project_id === selectedProject.id && m.sender === "client" && !m.read)
        .map((m) => m.id);
      
      if (unreadIds.length > 0) {
        supabase
          .from("messages")
          .update({ read: true })
          .in("id", unreadIds)
          .then(() => {
            // Recargar todos los mensajes para actualizar contadores
            loadAllMessages();
          });
      }
    }
  }, [selectedProject?.id, messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filtrar proyectos por búsqueda (por nombre de proyecto o cliente)
  const filteredProjects = projects.filter(
    (project) =>
      project.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.client_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || false)
  );

  // Obtener mensajes del proyecto seleccionado
  const projectMessages = selectedProject
    ? messages.filter((m) => m.project_id === selectedProject.id)
    : [];

  // Obtener último mensaje de cada proyecto
  const getLastMessage = (projectId: string) => {
    const projectMsgs = messages.filter((m) => m.project_id === projectId);
    return projectMsgs[projectMsgs.length - 1];
  };

  // Contar mensajes no leídos de un proyecto
  const getUnreadCount = (projectId: string) => {
    return messages.filter(
      (m) => m.project_id === projectId && m.sender === "client" && !m.read
    ).length;
  };

  // Enviar mensaje
  async function handleSendMessage() {
    if (!messageInput.trim() || !selectedProject) return;

    // Insertar mensaje en Supabase
    const { error } = await supabase.from("messages").insert([
      {
        project_id: selectedProject.id,
        sender: "admin",
        text: messageInput,
      },
    ]);

    if (!error) {
      setMessageInput("");
      // Recargar mensajes
      await loadMessagesForProject(selectedProject.id);
    }
  }

  // Formatear fecha
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);

    if (hours < 24) {
      return date.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (hours < 48) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 100px)",
        background: "#f6f7fa",
      }}
    >
      {/* Sidebar de Proyectos */}
      <div
        style={{
          width: 380,
          background: "#fff",
          borderRight: "1px solid #e6eaf0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid #e6eaf0",
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#111", marginBottom: 16, fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.02em" }}>
            Mensajes
          </h2>
          {/* Barra de búsqueda */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "#f6f7fa",
              borderRadius: 10,
            }}
          >
            <FiSearch size={18} color="#666" />
            <input
              type="text"
              placeholder="Buscar proyecto o cliente..."
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
        </div>

        {/* Lista de Proyectos */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredProjects.length === 0 ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#666",
              }}
            >
              <FiUser size={48} color="#ccc" style={{ marginBottom: 12 }} />
              <p>No hay proyectos</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const lastMessage = getLastMessage(project.id);
              const unreadCount = getUnreadCount(project.id);
              const isSelected = selectedProject?.id === project.id;

              return (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  style={{
                    padding: "16px 20px",
                    cursor: "pointer",
                    background: isSelected ? "#f6f7fa" : "#fff",
                    borderLeft: isSelected ? "3px solid #0049ff" : "3px solid transparent",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#fafbfc";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = "#fff";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* Avatar */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: "#0049ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {project.nombre.charAt(0).toUpperCase()}
                    </div>

                    {/* Info del proyecto */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: "#111",
                          }}
                        >
                          {project.nombre}
                        </span>
                        {lastMessage && (
                          <span
                            style={{
                              fontSize: 12,
                              color: "#666",
                            }}
                          >
                            {formatMessageTime(lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            color: "#666",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {lastMessage?.text || project.client_nombre || "Sin mensajes"}
                        </span>
                        {unreadCount > 0 && (
                          <div
                            style={{
                              minWidth: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "#0049ff",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 11,
                              fontWeight: 700,
                              marginLeft: 8,
                            }}
                          >
                            {unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Área de Chat */}
      {!selectedProject ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 16,
            color: "#666",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: "#f6f7fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiUser size={48} color="#ccc" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", letterSpacing: "-0.01em" }}>
            Selecciona un proyecto
          </h3>
          <p style={{ fontSize: 15 }}>Elige un proyecto de la lista para comenzar a chatear</p>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "#fff",
          }}
        >
          {/* Header del Chat */}
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e6eaf0",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#0049ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {selectedProject.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>
                {selectedProject.nombre}
              </div>
              <div style={{ fontSize: 13, color: "#666" }}>{selectedProject.client_nombre}</div>
            </div>
          </div>

          {/* Mensajes */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 24,
              background: "#fafbfc",
            }}
          >
            {projectMessages.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "#666",
                }}
              >
                <p>No hay mensajes aún. Inicia la conversación!</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {projectMessages.map((message) => {
                  const isAdmin = message.sender === "admin";
                  return (
                    <div
                      key={message.id}
                      style={{
                        display: "flex",
                        justifyContent: isAdmin ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "60%",
                          padding: "12px 16px",
                          borderRadius: isAdmin ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                          background: isAdmin ? "#0049ff" : "#fff",
                          color: isAdmin ? "#fff" : "#111",
                          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 4 }}>
                          {message.text}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: isAdmin ? "rgba(255, 255, 255, 0.7)" : "#666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 4,
                          }}
                        >
                          {formatMessageTime(message.timestamp)}
                          {isAdmin && (
                            message.read ? (
                              <FiCheckCircle size={12} />
                            ) : (
                              <FiCircle size={12} />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Input de Mensaje */}
          <div
            style={{
              padding: 20,
              borderTop: "1px solid #e6eaf0",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                background: "#f6f7fa",
                borderRadius: 24,
              }}
            >
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: 15,
                  color: "#111",
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: messageInput.trim() ? "#0049ff" : "#e6eaf0",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: messageInput.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                <FiSend size={18} color={messageInput.trim() ? "#fff" : "#999"} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
