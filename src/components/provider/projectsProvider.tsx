"use client";

import { useAuth } from "@/hooks/use-auth";
import { importedProjectsRef, projectsRef } from "@/lib/firebase";
import { Project } from "@/lib/type";
import { addDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { Edge, Node } from "reactflow";

export interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
}

export const ProjectsContext = createContext<ProjectsContextType | undefined>(
  undefined
);

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const docRef = query(projectsRef, where("uid", "==", user?.uid));
        const data = await getDocs(docRef);

        const documents = data.docs.map(
          (doc) =>
            ({
              ...doc.data(),
            } as Project)
        );

        setProjects(documents);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
    return;
  }, [user]);

  const addProject = async (project: Project) => {
    try {
      await addDoc(projectsRef, {
        ...project,
      });

      await addDoc(importedProjectsRef, {
        id: project.id,
        importedProjects: []
      })

      setProjects((prev) => [...prev, project]);
    } catch (error) {
      console.error(error);
    }
  };

  const updateProject = async (project: Project) => {
    try {
      const docRef = query(projectsRef, where("uid", "==", user?.uid));
      const data = await getDocs(docRef);

      await updateDoc(data.docs[0].ref, {
        ...project,
      });

      const newProjects = projects.map((p) => {
        if (p.id === project.id) {
          return project;
        }
        return p;
      });

      setProjects(newProjects);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
