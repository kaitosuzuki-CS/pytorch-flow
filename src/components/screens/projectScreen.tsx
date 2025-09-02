"use client";

import { InteractionMode, Project } from "@/lib/type";
import { Header } from "../components/header";
import { useEffect, useState } from "react";
import Canvas from "../components/flow/canvas";
import { useImports } from "@/hooks/use-imports";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";

interface ProjectScreenProps {
  projectId: string;
  isViewOnly: boolean;
}

export default function ProjectScreen({
  projectId,
  isViewOnly,
}: ProjectScreenProps) {
  const {user} = useAuth();
  const [project, setProject] = useState<Project | null>(null);

  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("selection");

  useEffect(() => {
    if (user) {
      const 
    }
  })

  // const { projects } = useProjects();

  // useEffect(() => {
  //   const p = projects.find((p) => p.id === projectId);
  //   console.log(p);
  //   console.log(projects);
  //   if (p) {
  //     setProject(p);
  //     // loadImportedProjects(projectId);
  //   }
  // }, [projectId]);

  const handleExport = () => {};

  if (!project) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        project={project}
        onExport={isViewOnly ? null : handleExport}
        interactionMode={interactionMode}
        onInteractionModeChange={setInteractionMode}
      />

      <main
        className={
          isViewOnly
            ? "flex-1 flex flex-col items-center justify-center p-4"
            : "flex flex-1 overflow-hidden"
        }
      >
        <Canvas
          project={project}
          isViewOnly={isViewOnly}
          interactionMode={interactionMode}
        />
      </main>
    </div>
  );
}
