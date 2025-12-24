import { create } from 'zustand';

export interface Client {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa?: string;
  notas?: string;
}

interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  selectClient: (client: Client | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useClientsStore = create<ClientsState>((set) => ({
  clients: [],
  selectedClient: null,
  isLoading: false,
  error: null,

  setClients: (clients) => set({ clients, error: null }),

  addClient: (client) =>
    set((state) => ({
      clients: [...state.clients, client],
      error: null,
    })),

  updateClient: (id, updates) =>
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
      selectedClient:
        state.selectedClient?.id === id
          ? { ...state.selectedClient, ...updates }
          : state.selectedClient,
      error: null,
    })),

  deleteClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
      selectedClient:
        state.selectedClient?.id === id ? null : state.selectedClient,
      error: null,
    })),

  selectClient: (client) => set({ selectedClient: client }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
