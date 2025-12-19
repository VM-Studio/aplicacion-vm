"use client";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import ClientModal from "./components/ClientModal";
import ProjectModal from "./components/ProjectModal";
import ChecklistProjectSelectorModal from "./components/ChecklistProjectSelectorModal";
import ChecklistModal from "./components/ChecklistModal";
import CodigoProyectoModal from "./components/CodigoProyectoModal";
import PaymentModal, { PaymentForm } from "./components/PaymentModal";
import MeetingModal, { MeetingForm } from "./components/MeetingModal";
import ProjectsPage from "./components/proyectos/ProjectsPage";
import NotificationsPage from "./components/notificaciones/NotificationsPage";
import ClientesPage from "./components/clientes/ClientesPage";
import ChecklistPage from "./components/checklist/ChecklistPage";
import PagosPage from "./components/pagos/PagosPage";
import MeetingsPage from "./components/meetings/MeetingsPage";
import PresupuestosPage from "./components/presupuestos/PresupuestosPage";
import ModificacionesPage from "./components/modificaciones/ModificacionesPage";
import { SidebarSection, Client, Project, ClientForm, ProjectForm, Task } from "./types";
import { generarCodigoUnico, calcularAvance } from "./utils";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedSection, setSelectedSection] = useState<SidebarSection>("Proyectos");
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Estados para clientes y proyectos
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  // Estado para pagos
  interface Payment {
    id: string;
    proyecto_id: string;
    monto: number;
    fecha_pago: string;
    metodo_pago: string;
    estado: "Pagado" | "Pendiente" | "Vencido";
    descripcion: string;
  }
  const [payments, setPayments] = useState<Payment[]>([]);

  // Estado para meetings
  interface Meeting {
    id: string;
    proyecto_id: string;
    titulo: string;
    fecha: string;
    hora: string;
    duracion: string;
    tipo: "Presencial" | "Virtual" | "Telefónica";
    estado: "Programada" | "Completada" | "Cancelada";
    asistentes: string[];
    notas: string;
    link_reunion?: string;
  }
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  // Estados para modales
  const [showClientModal, setShowClientModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedChecklistProject, setSelectedChecklistProject] = useState<Project | null>(null);
  const [lastProjectCode, setLastProjectCode] = useState<string | null>(null);

  // Formularios
  const [clientForm, setClientForm] = useState<ClientForm>({
    id: "",
    nombre: "",
    rubro: "",
    telefono: "",
    email: "",
    direccion: "",
    notas: "",
  });
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    nombre: "",
    cliente_id: "",
    descripcion: "",
    fecha_estimada: "",
    url_vercel: "",
  });
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    id: "",
    proyecto_id: "",
    monto: 0,
    fecha_pago: "",
    metodo_pago: "",
    estado: "Pendiente",
    descripcion: "",
  });
  const [meetingForm, setMeetingForm] = useState<MeetingForm>({
    id: "",
    proyecto_id: "",
    titulo: "",
    fecha: "",
    hora: "",
    duracion: "",
    tipo: "Virtual",
    estado: "Programada",
    asistentes: "",
    notas: "",
    link_reunion: "",
  });

  // Cargar datos desde Supabase
  useEffect(() => {
    async function fetchData() {
      // Cargar clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from("clients")
        .select("*");
      if (!clientsError && clientsData) {
        setClients(clientsData);
      }

      // Cargar proyectos
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("*");
      if (!projectsError && projectsData) {
        setProjects(projectsData);
      }

      // Cargar pagos
      const { data: paymentsData, error: paymentsError } = await supabase
        .from("payments")
        .select("*");
      if (!paymentsError && paymentsData) {
        setPayments(paymentsData);
      }

      // Cargar meetings
      const { data: meetingsData, error: meetingsError } = await supabase
        .from("meetings")
        .select("*");
      if (!meetingsError && meetingsData) {
        setMeetings(meetingsData);
      }
    }
    fetchData();
  }, []);

  // Función para generar link de Google Meet
  function generateGoogleMeetLink(): string {
    // Genera un código único para el meet
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const generateSegment = (length: number) => {
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    };
    
    // Formato: meet.google.com/xxx-xxxx-xxx
    return `https://meet.google.com/${generateSegment(3)}-${generateSegment(4)}-${generateSegment(3)}`;
  }

  const handleLogout = () => {
    router.push("/auth");
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handlers de formulario de cliente
  function handleClientChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setClientForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleClientSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Validación de campos requeridos
    if (!clientForm.nombre || !clientForm.rubro || !clientForm.email || !clientForm.telefono) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    try {
      const clientData = {
        nombre: clientForm.nombre,
        rubro: clientForm.rubro,
        email: clientForm.email,
        telefono: clientForm.telefono,
        direccion: clientForm.direccion || null,
        notas: clientForm.notas || null,
      };

      if (clientForm.id) {
        // Actualizar cliente existente
        const { data, error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", clientForm.id)
          .select()
          .single();

        if (error) {
          console.error("Error de Supabase:", error);
          alert(`Error al actualizar el cliente: ${error.message}`);
          return;
        }

        if (data) {
          setClients((prev) => prev.map((c) => (c.id === data.id ? data : c)));
          setClientForm({
            id: "",
            nombre: "",
            rubro: "",
            telefono: "",
            email: "",
            direccion: "",
            notas: "",
          });
          setShowClientModal(false);
        }
      } else {
        // Crear nuevo cliente
        const { data, error } = await supabase
          .from("clients")
          .insert([clientData])
          .select()
          .single();

        if (error) {
          console.error("Error de Supabase:", error);
          alert(`Error al guardar el cliente: ${error.message}\n\nDetalles: ${error.details || "Sin detalles"}`);
          return;
        }

        if (data) {
          setClients((prev) => [...prev, data]);
          setClientForm({
            id: "",
            nombre: "",
            rubro: "",
            telefono: "",
            email: "",
            direccion: "",
            notas: "",
          });
          setShowClientModal(false);
        }
      }
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      alert(`Error al guardar el cliente: ${err instanceof Error ? err.message : "Error desconocido"}\n\nVerifica tu conexión a Supabase.`);
    }
  }

  // Handlers de formulario de proyecto
  function handleProjectChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleProjectSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (projectForm.nombre && projectForm.cliente_id && projectForm.descripcion && projectForm.fecha_estimada) {
      const { data, error} = await supabase
        .from("projects")
        .insert([
          {
            nombre: projectForm.nombre,
            cliente_id: projectForm.cliente_id,
            descripcion: projectForm.descripcion,
            codigo: generarCodigoUnico(), // Fallback si el trigger no funciona
            checklists: [],
            fecha_estimada: projectForm.fecha_estimada,
            avance: 0,
            url_proyecto: projectForm.url_vercel, // URL de Vercel
          },
        ])
        .select()
        .single();

      if (!error && data) {
        // Verificar si el proyecto ya existe antes de agregarlo
        setProjects((prev) => {
          const exists = prev.some(p => p.id === data.id);
          if (exists) {
            return prev;
          }
          return [...prev, data];
        });
        // Mostrar el código generado automáticamente
        setLastProjectCode(data.codigo_proyecto || data.codigo);
      } else {
        alert("Error al guardar el proyecto: " + (error?.message || "Error desconocido"));
        console.error(error);
      }
      setProjectForm({ nombre: "", cliente_id: "", descripcion: "", fecha_estimada: "", url_vercel: "" });
      setShowProjectModal(false);
    }
  }

  // Handler para eliminar proyecto
  async function handleDeleteProject(projectId: string) {
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } else {
      alert("Error al eliminar el proyecto: " + (error?.message || "Error desconocido"));
      console.error(error);
    }
  }

  // Handler para seleccionar proyecto y abrir modal de checklist
  function handleSelectChecklistProject(project: Project) {
    setSelectedChecklistProject(project);
    setShowChecklistModal(false);
  }

  // Handler para guardar checklist
  async function handleSaveChecklist(projectId: string, tasks: Task[]) {
    const avance = calcularAvance(tasks);
    const { data, error } = await supabase
      .from("projects")
      .update({ checklists: tasks, avance })
      .eq("id", projectId)
      .select()
      .single();

    if (!error && data) {
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, checklists: tasks, avance } : p)));
      setSelectedChecklistProject(null);
    } else {
      alert("Error al guardar el checklist: " + (error?.message || "Error desconocido"));
      console.error(error);
    }
  }

  // Handlers para pagos
  function handlePaymentChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: name === "monto" ? parseFloat(value) || 0 : value,
    }));
  }

  async function handlePaymentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      paymentForm.proyecto_id &&
      paymentForm.monto > 0 &&
      paymentForm.fecha_pago &&
      paymentForm.metodo_pago &&
      paymentForm.estado
    ) {
      const paymentData = {
        proyecto_id: paymentForm.proyecto_id,
        monto: paymentForm.monto,
        fecha_pago: paymentForm.fecha_pago,
        metodo_pago: paymentForm.metodo_pago,
        estado: paymentForm.estado,
        descripcion: paymentForm.descripcion || null,
      };

      if (paymentForm.id) {
        // Actualizar pago existente
        const { data, error } = await supabase
          .from("payments")
          .update(paymentData)
          .eq("id", paymentForm.id)
          .select()
          .single();

        if (!error && data) {
          setPayments((prev) => prev.map((p) => (p.id === data.id ? data : p)));
          setPaymentForm({
            id: "",
            proyecto_id: "",
            monto: 0,
            fecha_pago: "",
            metodo_pago: "",
            estado: "Pendiente",
            descripcion: "",
          });
          setShowPaymentModal(false);
        } else {
          alert("Error al actualizar el pago: " + (error?.message || "Error desconocido"));
          console.error(error);
        }
      } else {
        // Crear nuevo pago
        const { data, error } = await supabase
          .from("payments")
          .insert([paymentData])
          .select()
          .single();

        if (!error && data) {
          setPayments((prev) => [...prev, data]);
          setPaymentForm({
            id: "",
            proyecto_id: "",
            monto: 0,
            fecha_pago: "",
            metodo_pago: "",
            estado: "Pendiente",
            descripcion: "",
          });
          setShowPaymentModal(false);
        } else {
          alert("Error al guardar el pago: " + (error?.message || "Error desconocido"));
          console.error(error);
        }
      }
    }
  }

  // Handlers para meetings
  function handleMeetingChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    
    // Si se cambia el tipo a Virtual y no hay link, generar uno
    if (name === "tipo" && value === "Virtual" && !meetingForm.link_reunion) {
      setMeetingForm((prev) => ({
        ...prev,
        tipo: value as "Presencial" | "Virtual" | "Telefónica",
        link_reunion: generateGoogleMeetLink(),
      }));
    } else if (name === "tipo" && value !== "Virtual") {
      // Si se cambia a otro tipo, limpiar el link
      setMeetingForm((prev) => ({
        ...prev,
        tipo: value as "Presencial" | "Virtual" | "Telefónica",
        link_reunion: "",
      }));
    } else {
      setMeetingForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleMeetingSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      meetingForm.proyecto_id &&
      meetingForm.titulo &&
      meetingForm.fecha &&
      meetingForm.hora &&
      meetingForm.duracion &&
      meetingForm.tipo &&
      meetingForm.estado
    ) {
      // Convertir asistentes de string a array
      const asistentesArray = meetingForm.asistentes
        ? meetingForm.asistentes.split(",").map((a) => a.trim()).filter((a) => a)
        : [];

      const meetingData = {
        proyecto_id: meetingForm.proyecto_id,
        titulo: meetingForm.titulo,
        fecha: meetingForm.fecha,
        hora: meetingForm.hora,
        duracion: meetingForm.duracion,
        tipo: meetingForm.tipo,
        estado: meetingForm.estado,
        asistentes: asistentesArray,
        notas: meetingForm.notas || null,
        link_reunion: meetingForm.tipo === "Virtual" ? meetingForm.link_reunion : null,
      };

      if (meetingForm.id) {
        // Actualizar meeting existente
        const { data, error } = await supabase
          .from("meetings")
          .update(meetingData)
          .eq("id", meetingForm.id)
          .select()
          .single();

        if (!error && data) {
          setMeetings((prev) => prev.map((m) => (m.id === data.id ? data : m)));
          setMeetingForm({
            id: "",
            proyecto_id: "",
            titulo: "",
            fecha: "",
            hora: "",
            duracion: "",
            tipo: "Virtual",
            estado: "Programada",
            asistentes: "",
            notas: "",
            link_reunion: "",
          });
          setShowMeetingModal(false);
        } else {
          alert("Error al actualizar la reunión: " + (error?.message || "Error desconocido"));
          console.error(error);
        }
      } else {
        // Crear nueva meeting
        const { data, error } = await supabase
          .from("meetings")
          .insert([meetingData])
          .select()
          .single();

        if (!error && data) {
          setMeetings((prev) => [...prev, data]);
          setMeetingForm({
            id: "",
            proyecto_id: "",
            titulo: "",
            fecha: "",
            hora: "",
            duracion: "",
            tipo: "Virtual",
            estado: "Programada",
            asistentes: "",
            notas: "",
            link_reunion: "",
          });
          setShowMeetingModal(false);
        } else {
          alert("Error al agendar la reunión: " + (error?.message || "Error desconocido"));
          console.error(error);
        }
      }
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" }}>
      <AdminNavbar onLogout={handleLogout} />
      <AdminSidebar
        selected={selectedSection}
        setSelected={setSelectedSection}
        onShowProjectModal={() => setShowProjectModal(true)}
        onShowClientModal={() => {
          setClientForm({
            id: "",
            nombre: "",
            rubro: "",
            telefono: "",
            email: "",
            direccion: "",
            notas: "",
          });
          setShowClientModal(true);
        }}
        onShowChecklistModal={() => setShowChecklistModal(true)}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />
      <div
        style={{
          marginTop: isMobile ? 60 : 100,
          marginLeft: isMobile ? 0 : (sidebarOpen ? 220 : 48),
          transition: "margin-left 0.2s",
          flex: 1,
          minHeight: isMobile ? "calc(100vh - 60px)" : "calc(100vh - 100px)",
          background: "#fff",
          padding: isMobile ? "16px" : "0",
        }}
      >
        {/* Renderizar contenido según la sección seleccionada */}
        {selectedSection === "Proyectos" && (
          <ProjectsPage projects={projects} clients={clients} onDeleteProject={handleDeleteProject} />
        )}
        
        {selectedSection === "Notificaciones" && (
          <NotificationsPage clients={clients} />
        )}

        {selectedSection === "Ver clientes" && (
          <ClientesPage
            clients={clients}
            onEdit={(client) => {
              setClientForm({
                id: client.id,
                nombre: client.nombre,
                rubro: client.rubro,
                telefono: client.telefono,
                email: client.email,
                direccion: client.direccion || "",
                notas: client.notas || "",
              });
              setShowClientModal(true);
            }}
            onDelete={async (clientId) => {
              if (confirm("¿Estás seguro de eliminar este cliente?")) {
                const { error } = await supabase.from("clients").delete().eq("id", clientId);
                if (!error) {
                  setClients(clients.filter((c) => c.id !== clientId));
                }
              }
            }}
            onAdd={() => {
              setClientForm({
                id: "",
                nombre: "",
                rubro: "",
                telefono: "",
                email: "",
                direccion: "",
                notas: "",
              });
              setShowClientModal(true);
            }}
          />
        )}

        {selectedSection === "Ver Checklist" && (
          <ChecklistPage
            projects={projects}
            clients={clients}
            onUpdateTask={async (projectId, taskIndex, updatedTask) => {
              const project = projects.find((p) => p.id === projectId);
              if (project) {
                const updatedChecklists = [...project.checklists];
                updatedChecklists[taskIndex] = updatedTask;
                
                // Calcular nuevo avance basado en tareas completadas
                const avance = calcularAvance(updatedChecklists);

                const { data, error } = await supabase
                  .from("projects")
                  .update({ checklists: updatedChecklists, avance })
                  .eq("id", projectId)
                  .select()
                  .single();

                if (!error && data) {
                  setProjects((prev) => prev.map((p) => (p.id === projectId ? data : p)));
                }
              }
            }}
          />
        )}

        {selectedSection === "Pagos" && (
          <PagosPage
            projects={projects}
            clients={clients}
            payments={payments}
            onAddPayment={() => {
              setPaymentForm({
                id: "",
                proyecto_id: "",
                monto: 0,
                fecha_pago: "",
                metodo_pago: "",
                estado: "Pendiente",
                descripcion: "",
              });
              setShowPaymentModal(true);
            }}
            onEditPayment={(payment) => {
              setPaymentForm({
                id: payment.id,
                proyecto_id: payment.proyecto_id,
                monto: payment.monto,
                fecha_pago: payment.fecha_pago,
                metodo_pago: payment.metodo_pago,
                estado: payment.estado,
                descripcion: payment.descripcion,
              });
              setShowPaymentModal(true);
            }}
            onDeletePayment={async (paymentId) => {
              if (confirm("¿Estás seguro de eliminar este pago?")) {
                const { error } = await supabase.from("payments").delete().eq("id", paymentId);
                if (!error) {
                  setPayments(payments.filter((p) => p.id !== paymentId));
                } else {
                  alert("Error al eliminar el pago: " + (error?.message || "Error desconocido"));
                  console.error(error);
                }
              }
            }}
          />
        )}

        {selectedSection === "Meetings" && (
          <MeetingsPage
            projects={projects}
            clients={clients}
            meetings={meetings}
            onAddMeeting={() => {
              const newLink = generateGoogleMeetLink();
              setMeetingForm({
                id: "",
                proyecto_id: "",
                titulo: "",
                fecha: "",
                hora: "",
                duracion: "",
                tipo: "Virtual",
                estado: "Programada",
                asistentes: "",
                notas: "",
                link_reunion: newLink,
              });
              setShowMeetingModal(true);
            }}
            onEditMeeting={(meeting) => {
              setMeetingForm({
                id: meeting.id,
                proyecto_id: meeting.proyecto_id,
                titulo: meeting.titulo,
                fecha: meeting.fecha,
                hora: meeting.hora,
                duracion: meeting.duracion,
                tipo: meeting.tipo,
                estado: meeting.estado,
                asistentes: meeting.asistentes.join(", "),
                notas: meeting.notas,
                link_reunion: meeting.link_reunion || "",
              });
              setShowMeetingModal(true);
            }}
            onDeleteMeeting={async (meetingId) => {
              if (confirm("¿Estás seguro de eliminar esta reunión?")) {
                const { error } = await supabase.from("meetings").delete().eq("id", meetingId);
                if (!error) {
                  setMeetings(meetings.filter((m) => m.id !== meetingId));
                } else {
                  alert("Error al eliminar la reunión: " + (error?.message || "Error desconocido"));
                  console.error(error);
                }
              }
            }}
          />
        )}

        {selectedSection === "Presupuesto" && (
          <PresupuestosPage projects={projects} clients={clients} />
        )}

        {selectedSection === "Modificaciones" && (
          <ModificacionesPage projects={projects} />
        )}
      </div>

      {/* Modales */}
      {showClientModal && (
        <ClientModal
          clientForm={clientForm}
          onChange={handleClientChange}
          onSubmit={handleClientSubmit}
          onClose={() => setShowClientModal(false)}
        />
      )}

      {showProjectModal && (
        <ProjectModal
          projectForm={projectForm}
          clients={clients}
          onChange={handleProjectChange}
          onSubmit={handleProjectSubmit}
          onClose={() => setShowProjectModal(false)}
        />
      )}

      {showChecklistModal && (
        <ChecklistProjectSelectorModal
          projects={projects}
          onSelect={handleSelectChecklistProject}
          onClose={() => setShowChecklistModal(false)}
        />
      )}

      {selectedChecklistProject && (
        <ChecklistModal
          project={selectedChecklistProject}
          onSave={handleSaveChecklist}
          onClose={() => setSelectedChecklistProject(null)}
        />
      )}

      {lastProjectCode && (
        <CodigoProyectoModal codigo={lastProjectCode} onClose={() => setLastProjectCode(null)} />
      )}

      {showPaymentModal && (
        <PaymentModal
          paymentForm={paymentForm}
          projects={projects}
          onChange={handlePaymentChange}
          onSubmit={handlePaymentSubmit}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {showMeetingModal && (
        <MeetingModal
          meetingForm={meetingForm}
          projects={projects}
          onChange={handleMeetingChange}
          onSubmit={handleMeetingSubmit}
          onClose={() => setShowMeetingModal(false)}
        />
      )}
    </div>
  );
}
