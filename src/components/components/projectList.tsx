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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { toast } = useToast();

  const handleOpen = (project: Project) => {
    onOpenProject(project);
  };

  const handleImport = (projectToImport: Project) => {};

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return projects;
    }

    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const rankedProjects = projects
      .map((project) => {
        let score = 0;
        const name = project.name.toLowerCase();
        const description = project.description?.toLowerCase() || "";

        searchWords.forEach((word) => {
          if (name.includes(word)) {
            score += 2; // Higher weight for title matches
          }
          if (description.includes(word)) {
            score += 1;
          }
        });

        return { ...project, score };
      })
      .filter((project) => project.score > 0)
      .sort((a, b) => b.score - a.score);

    return rankedProjects;
  }, [searchQuery, projects]);

  return (
    <div className="h-screen flex flex-col gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10"
        />
      </div>
      <div className="flex flex-col h-screen gap-4">
        <ScrollArea className="flex-grow">
          <div className="flex flex-col gap-4 pr-4">
            {projects.map((project) => (
              <div key={project.id} className="border-b last:border-b-0">
                <div className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold hover:underline cursor-pointer">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4">
                    <Badge variant="secondary">Public</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(project)}
                    >
                      Open
                      <ArrowRight className="w-4 h-4 ml-2" />
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
    </div>
  );
}
