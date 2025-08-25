
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/type';
import Link from 'next/link';
import { ArrowRight, Import } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { projects as allProjects } from '@/data/projects.json';
import { useStore } from '@/hooks/use-app-store';
import { useSearchParams } from 'next/navigation';

interface ProjectListProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  isImportContext: boolean;
}

export function ProjectList({ projects, isImportContext }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const { addImportedProject } = useStore();
  const searchParams = useSearchParams();
  const fromProjectId = searchParams.get('projectId');

  const handleTitleClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSheetClose = () => {
    setSelectedProject(null);
  };

  const handleImport = (projectToImport: Project) => {
    const fullProject = allProjects.find(p => p.id === projectToImport.id);
    if (fullProject) {
        addImportedProject({
            id: fullProject.id,
            name: fullProject.name,
            description: fullProject.description,
            nodes: fullProject.nodes || [],
            edges: fullProject.edges || [],
        });
        toast({
            title: "Project Imported",
            description: `"${fullProject.name}" is now available in your components panel.`,
        });
    }
  }

  return (
    <div>
      <div className="border rounded-lg">
        {projects.map(project => (
          <div key={project.id} className="border-b last:border-b-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex-1">
                <h3 
                  className="text-lg font-semibold hover:underline cursor-pointer"
                  onClick={() => handleTitleClick(project)}
                >
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              </div>
              <div className="flex items-center gap-4 ml-4">
                 <Badge variant="secondary">Public</Badge>
                 <Link 
                    href={`/projects/${project.id}?view=true${fromProjectId ? `&fromProjectId=${fromProjectId}` : ''}`} 
                    passHref
                 >
                    <Button variant="outline" size="sm">
                        Open
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </Link>
                 {isImportContext && (
                    <Button variant="default" size="sm" onClick={() => handleImport(project)}>
                        Import
                        <Import className="w-4 h-4 ml-2" />
                    </Button>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sheet open={!!selectedProject} onOpenChange={(open) => !open && handleSheetClose()}>
        <SheetContent className="sm:max-w-2xl w-full">
          {selectedProject && (
            <>
              <SheetHeader>
                <SheetTitle className="font-headline text-2xl">{selectedProject.name}</SheetTitle>
                <SheetDescription>{selectedProject.description}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 aspect-video relative">
                <Image
                    src={selectedProject.imageUrl}
                    alt={selectedProject.name}
                    fill
                    className="rounded-lg object-cover border"
                    data-ai-hint={selectedProject['data-ai-hint']}
                />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
