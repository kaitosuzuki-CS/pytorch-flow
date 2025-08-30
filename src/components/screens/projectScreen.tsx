"use client";

import { InteractionMode, Project } from "@/lib/type";
import { Header } from "../components/header";
import { useEffect, useState } from "react";
import Canvas from "../components/flow/canvas";
import { useImports } from "@/hooks/use-imports";

interface ProjectScreenProps {
  project: Project;
  isViewOnly: boolean;
}

export default function ProjectScreen({
  project,
  isViewOnly,
}: ProjectScreenProps) {
  const { loadImportedProjects } = useImports();
  const [interactionMode, setInteractionMode] =
    useState<InteractionMode>("selection");

  useEffect(() => {
    loadImportedProjects(project.id);
  }, [project]);

  const handleExport = () => {};

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
