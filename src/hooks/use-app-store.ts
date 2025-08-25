
import { create } from 'zustand';
import { ImportedProject } from '@/lib/type';

interface AppState {
  importedProjects: ImportedProject[];
  addImportedProject: (project: ImportedProject) => void;
  removeImportedProject: (projectId: string) => void;
}

export const useStore = create<AppState>((set) => ({
  importedProjects: [],
  addImportedProject: (project) => set((state) => ({
    importedProjects: [...state.importedProjects, project]
  })),
  removeImportedProject: (projectId) => set((state) => ({
    importedProjects: state.importedProjects.filter(p => p.id !== projectId)
  })),
}));
