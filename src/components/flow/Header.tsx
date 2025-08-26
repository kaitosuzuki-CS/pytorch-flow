
"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  Workflow,
  MousePointer,
  Move,
  Upload,
  ChevronRight,
} from "lucide-react";
import { InteractionMode, Project } from "@/lib/type";
import { Badge } from "../ui/badge";

type HeaderProps = {
  project: Project;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  interactionMode: InteractionMode;
  onInteractionModeChange: (mode: InteractionMode) => void;
};

export function Header({
  project,
  onExport,
  onImport,
  interactionMode,
  onInteractionModeChange,
}: HeaderProps) {
  const toggleInteractionMode = () => {
    onInteractionModeChange(
      interactionMode === "selection" ? "pan" : "selection"
    );
  };
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Workflow className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground hidden sm:block">
            FlowForge
          </h1>
        </Link>
        <ChevronRight className="w-6 h-6 text-muted-foreground" />
        <div className="flex items-center gap-2 min-w-0">
            <span className="font-medium text-lg truncate">{project.name}</span>
            <Badge variant={project.visibility === 'public' ? 'secondary' : 'outline'}>
                {project.visibility.charAt(0).toUpperCase() + project.visibility.slice(1)}
            </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={toggleInteractionMode}
          variant="outline"
          size="icon"
          title={
            interactionMode === "selection"
              ? "Switch to Pan Mode"
              : "Switch to Selection Mode"
          }
        >
          {interactionMode === "selection" ? (
            <MousePointer className="w-6 h-6" />
          ) : (
            <Move className="w-6 h-6" />
          )}
        </Button>
        <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".json"
            onChange={onImport}
        />
        <Button onClick={handleImportClick} variant="outline">
          <Upload className="w-4 h-4 mr-2" />
          Import JSON
        </Button>
        <Button onClick={onExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
      </div>
    </header>
  );
}
