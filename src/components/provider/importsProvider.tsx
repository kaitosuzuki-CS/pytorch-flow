"use client";

import { useAuth } from "@/hooks/use-auth";
import { importedProjectsRef } from "@/lib/firebase";
import { ImportedProject } from "@/lib/type";
import { getDocs, query, updateDoc, where } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { createContext, useState, useEffect } from "react";

export interface ImportsContextType {
  importedProjects: ImportedProject[];
  loadImportedProjects: (id: string) => void;
  addImportedProjects: (project: ImportedProject) => void;
  deleteImportedProjects: (project: ImportedProject) => void;
}

export const ImportsContext = createContext<ImportsContextType | undefined>(
  undefined,
);

export function ImportsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [importedProjects, setImportedProjects] = useState<ImportedProject[]>(
    [],
  );

  const loadImportedProjects = async (id: string) => {
    if (!user) return;

    if (id !== projectId) {
      try {
        const docRef = query(importedProjectsRef, where("id", "==", id));
        const data = await getDocs(docRef);

        const documents = data.docs[0].data();

        setImportedProjects(documents.importedProjects);
        setProjectId(id);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const addImportedProjects = async (project: ImportedProject) => {
    const newImportedProjects = [...importedProjects, project];

    try {
      const docRef = query(importedProjectsRef, where("id", "==", project.id));
      const data = await getDocs(docRef);

      await updateDoc(data.docs[0].ref, {
        importedProjects: newImportedProjects,
      });

      setImportedProjects(newImportedProjects);
    } catch (error) {
      console.error(error);
    }
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
