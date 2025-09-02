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

interface UserProjectScreenProps {
  projectId: string;
}

export default function UserProjectScreen({
  projectId,
}: UserProjectScreenProps) {
  const { projects } = useProjects();
  const { importedProjects } = useImports();
  const [project, setProject] = useState<Project | null>(null);

  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("selection");

  useEffect(() => {
    const p = projects.find((p) => p.id === projectId);

    if (p) {
      setProject(p);
    } else {
      setProject(null);
    }

    return;
  }, []);

  const handlePublish = () => {};

  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        project={project}
        onPublish={handlePublish}
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
      />

      <main className={"flex flex-1 overflow-hidden"}>
        <Canvas
          project={project}
          isViewOnly={false}
          interactionMode={interactionMode}
          importedProjects={importedProjects}
        />
      </main>
    </div>
  );
}
