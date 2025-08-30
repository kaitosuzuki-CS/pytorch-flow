"use client";

import { ImportedProject } from "@/lib/type";
import { createContext, useState, useEffect } from "react";

export interface ImportsContextType {
  importedProjects: ImportedProject[];
  loadImportedProjects: (id: string) => void;
  addImportedProjects: (project: ImportedProject) => void;
  deleteImportedProjects: (project: ImportedProject) => void;
}

export const ImportsContext = createContext<ImportsContextType | undefined>(
  undefined
);

export function ImportsProvider({ children }: { children: React.ReactNode }) {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [importedProjects, setImportedProjects] = useState<ImportedProject[]>(
    []
  );

  const loadImportedProjects = (id: string) => {
    if (id !== projectId) {
      setProjectId(id);
      setImportedProjects([]);
    }
  }

  const addImportedProjects = (project: ImportedProject) => {
    setImportedProjects((prev) => [...prev, project]);
  };

  const deleteImportedProjects = (project: ImportedProject) => {
    setImportedProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  return (
    <ImportsContext.Provider
      value={{
        importedProjects,
        loadImportedProjects,
        addImportedProjects,
        deleteImportedProjects,
      }}
    >
      {children}
    </ImportsContext.Provider>
  );
}
