"use client";

import { useAuth } from "@/hooks/use-auth";
import { projectsRef } from "@/lib/firebase";
import { Project } from "@/lib/type";
import { addDoc, getDocs, query, where } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

export interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  getProjects: () => void;
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
        uid: user?.uid,
      });

      setProjects((prev) => [...prev, project]);
    } catch (error) {
      console.error(error);
    }
  };

  const getProjects = () => {
    console.log(projects);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        addProject,
        getProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}
