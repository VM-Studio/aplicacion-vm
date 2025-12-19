"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import ClienteNavbar from "./components/ClienteNavbar";
import ClienteSidebar, { ClienteSidebarSection } from "./components/ClienteSidebar";
import CodigoProyectoModal from "./components/CodigoProyectoModal";
import MiProyectoPage from "./components/miProyecto/MiProyectoPage";
import ChecklistPage from "./components/checklist/ChecklistPage";
import NotificacionesPage from "./components/notificaciones/NotificacionesPage";
import PagosPage from "./components/pagos/PagosPage";
import PaymentModal from "./components/PaymentModal";
import VercelPreview from "./components/VercelPreview";

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

interface Message {
  id: string;
  project_id: string;
  sender: "client" | "admin";
  text: string;
  timestamp: string;
  read: boolean;
}

interface Payment {
  id: string;
  proyecto_id: string;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
  estado: "Pagado" | "Pendiente" | "Vencido";
  descripcion: string;
}

export default function ClientePage() {
  const [proyecto, setProyecto] = useState<Project | null>(null);
  const [needsCode, setNeedsCode] = useState(() => {
    // Inicializar basado en si hay proyecto guardado
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("cliente_project_id");
  });
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [sidebarSection, setSidebarSection] = useState<ClienteSidebarSection>("Proyecto");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [showPayModal, setShowPayModal] = useState<{ pago: Payment } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Verificar si ya tiene proyecto vinculado
  useEffect(() => {
    const loadProject = async () => {
      const storedId =
        typeof window !== "undefined" ? localStorage.getItem("cliente_project_id") : null;
      
      if (storedId && !needsCode) {
        // Ya tiene un proyecto, cargar sus datos (solo campos necesarios)
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("id, nombre, descripcion, fecha_estimada, avance, checklists, url_proyecto, codigo")
            .eq("id", storedId)
            .single();

          if (data && !error) {
            setProyecto(data as Project);
          } else {
            // El proyecto no existe o hubo error, pedir código nuevo
            localStorage.removeItem("cliente_project_id");
            setNeedsCode(true);
          }
        } catch {
          // Error al cargar, pedir código nuevo
          localStorage.removeItem("cliente_project_id");
          setNeedsCode(true);
        }
      }
      setIsLoadingProject(false);
    };

    loadProject();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Función para validar código de proyecto
  const handleValidarCodigo = async (codigo: string): Promise<boolean> => {
    try {
      // Buscar por el campo "codigo" que existe en la BD (solo campos necesarios)
      const { data, error } = await supabase
        .from("projects")
        .select("id, nombre, descripcion, fecha_estimada, avance, checklists, url_proyecto, codigo")
        .eq("codigo", codigo)
        .maybeSingle();

      if (data && !error) {
        // Código válido, guardar en localStorage
        localStorage.setItem("cliente_project_id", data.id);
        setProyecto(data as Project);
        setNeedsCode(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Suscripción en tiempo real deshabilitada para mejorar rendimiento
  // Se puede reactivar si es necesario
  // useEffect(() => {
  //   if (!proyecto?.id) return;
  //   const subscription = supabase
  //     .channel(`project-${proyecto.id}`)
  //     .on("postgres_changes", {
  //       event: "UPDATE",
  //       schema: "public",
  //       table: "projects",
  //       filter: `id=eq.${proyecto.id}`,
  //     }, (payload) => {
  //       setProyecto(payload.new as Project);
  //     })
  //     .subscribe();
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [proyecto?.id]);

  // Cargar contador de mensajes no leídos
  useEffect(() => {
    if (proyecto) {
      supabase
        .from("messages")
        .select("id", { count: 'exact' })
        .eq("project_id", proyecto.id)
        .eq("sender", "admin")
        .eq("read", false)
        .then(({ data }) => {
          if (data) setUnreadCount(data.length);
        });
    }
  }, [proyecto]);

  // Cargar mensajes cuando se abre Notificaciones
  useEffect(() => {
    if (proyecto && sidebarSection === "Notificaciones") {
      supabase
        .from("messages")
        .select("*")
        .eq("project_id", proyecto.id)
        .order("timestamp", { ascending: true })
        .then(({ data }) => {
          if (data) setMessages(data as Message[]);
        });
    }
  }, [proyecto, sidebarSection]);

  // Marcar mensajes como leídos
  useEffect(() => {
    if (
      sidebarSection === "Notificaciones" &&
      proyecto &&
      messages.some((m) => m.sender === "admin" && !m.read)
    ) {
      const unreadIds = messages.filter((m) => m.sender === "admin" && !m.read).map((m) => m.id);
      if (unreadIds.length > 0) {
        supabase
          .from("messages")
          .update({ read: true })
          .in("id", unreadIds)
          .then(() => {
            setUnreadCount(0);
          });
      }
    }
  }, [sidebarSection, proyecto?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll al final del chat
  useEffect(() => {
    if (sidebarSection === "Notificaciones" && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sidebarSection]);

  // Leer pagos del proyecto solo cuando se abre la sección
  useEffect(() => {
    if (proyecto && sidebarSection === "Pagos") {
      supabase
        .from("payments")
        .select("*")
        .eq("proyecto_id", proyecto.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setPagos(data as Payment[]);
        });
    }
  }, [proyecto, sidebarSection]);

  async function handleSendMessage() {
    if (chatInput.trim() && proyecto) {
      await supabase.from("messages").insert([
        {
          project_id: proyecto.id,
          sender: "client",
          text: chatInput,
        },
      ]);
      setChatInput("");
      // Refresca mensajes
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("project_id", proyecto.id)
        .order("timestamp", { ascending: true });
      if (data) setMessages(data as Message[]);
    }
  }

  function handlePagar(pago: Payment) {
    setShowPayModal({ pago });
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("cliente_project_id");
    }
    supabase.auth.signOut();
    window.location.href = "/auth";
  }

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Mostrar modal de código si es necesario
  if (needsCode) {
    return <CodigoProyectoModal onValidate={handleValidarCodigo} />;
  }

  // Mostrar loading mientras carga el proyecto
  if (isLoadingProject) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f7fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 60,
              height: 60,
              margin: "0 auto 20px",
              border: "4px solid #e6eaf0",
              borderTop: "4px solid #0049ff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ color: "#666", fontSize: 16 }}>Cargando tu proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f6f7fa",
      }}
    >
      <ClienteNavbar onLogout={handleLogout} />
      
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 98,
          }}
        />
      )}
      
      <div style={{ display: "flex", flex: 1, marginTop: isMobile ? 60 : 80 }}>
        <ClienteSidebar
          selected={sidebarSection}
          setSelected={(section) => {
            setSidebarSection(section);
            if (isMobile) setSidebarOpen(false);
          }}
          unreadCount={unreadCount}
          isMobile={isMobile}
          isOpen={sidebarOpen}
        />
        
        {/* Botón para abrir sidebar en móvil */}
        {isMobile && !sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#0049ff",
              border: "none",
              color: "#fff",
              fontSize: 24,
              fontWeight: "bold",
              boxShadow: "0 4px 12px rgba(0, 73, 255, 0.3)",
              cursor: "pointer",
              zIndex: 99,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ☰
          </button>
        )}
        
        <main
          style={{
            flex: 1,
            marginLeft: isMobile ? 0 : 260,
            padding: isMobile ? 16 : 40,
            minHeight: isMobile ? "calc(100vh - 60px)" : "calc(100vh - 80px)",
          }}
        >
          {sidebarSection === "Proyecto" && (
            <MiProyectoPage proyecto={proyecto} />
          )}

          {sidebarSection === "Checklist" && (
            <ChecklistPage proyecto={proyecto} />
          )}

          {sidebarSection === "Notificaciones" && (
            <NotificacionesPage
              messages={messages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
              chatEndRef={chatEndRef}
            />
          )}

          {sidebarSection === "Pagos" && (
            <PagosPage
              pagos={pagos}
              formatCurrency={formatCurrency}
              handlePagar={handlePagar}
            />
          )}
        </main>
      </div>

      {/* Modal de métodos de pago */}
      {showPayModal && (
        <PaymentModal
          pago={showPayModal.pago}
          formatCurrency={formatCurrency}
          onClose={() => setShowPayModal(null)}
        />
      )}

      {/* Botón flotante para ver la web en Vercel */}
      {proyecto?.url_proyecto ? (
        <VercelPreview url={proyecto.url_proyecto} />
      ) : (
        proyecto && (
          <div
            style={{
              position: "fixed",
              bottom: 30,
              right: 30,
              background: "#f6f7fa",
              color: "#666",
              border: "1px solid #e6eaf0",
              borderRadius: 16,
              padding: "18px 32px",
              fontSize: 14,
              fontWeight: 600,
              zIndex: 999,
            }}
          >
            URL de Vercel no configurada
          </div>
        )
      )}
    </div>
  );
}
