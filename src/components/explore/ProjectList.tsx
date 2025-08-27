"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/lib/type";
import Link from "next/link";
import { ArrowRight, Import, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projects as allProjects } from "@/data/projects.json";
import { useStore } from "@/hooks/use-app-store";
import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  isImportContext: boolean;
}

export function ProjectList({
  projects,
  onOpenProject,
  isImportContext,
}: ProjectListProps) {
  const { toast } = useToast();
  const { addImportedProject } = useStore();
  const searchParams = useSearchParams();
  const fromProjectId = searchParams.get("fromProjectId");
  const onProjectSelect = (project: Project) => {
    window.open(`/projects/${project.id}?view=true&fromProjectId=${fromProjectId || ""}`, "_blank");
  };

  const handleImport = (projectToImport: Project) => {
    const projectData = allProjects.find(p => p.id === projectToImport.id) as unknown as Project;
    if (projectData && projectData.nodes && projectData.edges) {
        addImportedProject({
            id: projectData.id,
            name: projectData.name,
            description: projectData.description,
            nodes: projectData.nodes,
            edges: projectData.edges,
        });
        toast({
            title: "Project Imported",
            description: `"${projectData.name}" is now available in your components panel.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Import Failed",
            description: `Could not find the project data for "${projectToImport.name}".`,
        });
    }
};

  return (
    <div className="flex flex-col gap-4 h-full">
      <ScrollArea className="flex-grow">
        <div className="flex flex-col gap-4 pr-4">
          {projects.map((project) => (
            <div key={project.id} className="border rounded-lg">
              <div className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold hover:underline cursor-pointer"
                    onClick={() => onProjectSelect(project)}
                  >
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="secondary">Public</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/projects/${project.id}`} target="_blank">
                      Open
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  {isImportContext && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleImport(project)}
                    >
                      Import
                      <Import className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}