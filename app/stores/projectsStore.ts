import { create } from 'zustand';

export interface Project {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_estimada: string;
  avance: number;
  cliente_id: string;
  cliente_nombre?: string;
  url_proyecto?: string;
  codigo?: string;
  checklists?: Array<{
    id: string;
    tarea: string;
    checked: boolean;
  }>;
}

interface ProjectsState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  selectProject: (project: Project | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  setProjects: (projects) => set({ projects, error: null }),

  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
      error: null,
    })),

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
      selectedProject:
        state.selectedProject?.id === id
          ? { ...state.selectedProject, ...updates }
          : state.selectedProject,
      error: null,
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProject:
        state.selectedProject?.id === id ? null : state.selectedProject,
      error: null,
    })),

  selectProject: (project) => set({ selectedProject: project }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
