"use client";

import { InteractionMode, Project } from "@/lib/type";
import { Header } from "../components/header";
import { useEffect, useState } from "react";
import Canvas from "../components/flow/canvas";
import { useImports } from "@/hooks/use-imports";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";
import { getDocs, query, where } from "firebase/firestore";
import { projectsRef } from "@/lib/firebase";

interface ProjectScreenProps {
  projectId: string;
}

export default function ProjectScreen({ projectId }: ProjectScreenProps) {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);

  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("selection");

  useEffect(() => {
    const getProject = async () => {
      try {
        const docRef = query(projectsRef, where("id", "==", projectId));
        const data = await getDocs(docRef);

        const document = data.docs[0].data() as Project;

        setProject(document);
      } catch (error) {
        setProject(null);
        console.error(error);
      }
    };

    getProject();
    return;
  }, []);

  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        project={project}
        onPublish={null}
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
      />

      <main
        className={
            "flex-1 flex flex-col items-center justify-center p-4"
        }
      >
        <Canvas
          project={project}
          isViewOnly={true}
          interactionMode={interactionMode}
        />
      </main>
    </div>
  );
}
