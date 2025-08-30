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
import type { ImportedProject, Project } from "@/lib/type";
import Link from "next/link";
import { ArrowRight, Import, Search, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { projects as allProjects } from "@/data/projects.json";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  pageType: string;
  onImportProject?: ((project: ImportedProject) => void) | null;
}

export function ProjectList({
  projects,
  onOpenProject,
  pageType,
  onImportProject,
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const handleOpen = (project: Project) => {
    onOpenProject(project);
  };

  const handleImport = (project: Project) => {
    if (onImportProject) {
      const projectToImport: ImportedProject = {
        id: project.id,
        name: project.name,
        description: project.description,
        nodes: project.nodes || [],
        edges: project.edges || [],
      };
      onImportProject(projectToImport);
    }
  };

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
    <>
      <div className="flex w-full items-center space-x-2 my-4 flex-shrink-0">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>
      <ScrollArea className="flex-grow pr-2">
        <div className="flex flex-col gap-4">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
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
                    {pageType === "dashboard" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/app/settings/${project.id}`)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}

                    <Badge variant="secondary">{project.visibility}</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpen(project)}
                    >
                      Open
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    {pageType === "import" && (
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
            ))
          ) : (
            <Card className="text-center py-12 bg-background">
              <CardHeader>
                <CardTitle>No Results Found</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Try adjusting your search terms to find what you're looking
                  for.
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </>
  );
}
