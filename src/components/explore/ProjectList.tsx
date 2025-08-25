
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/type';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
}

export function ProjectList({ projects }: ProjectListProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleTitleClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSheetClose = () => {
    setSelectedProject(null);
  };

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
                 <Link href={`/projects/${project.id}`} passHref>
                    <Button variant="outline" size="sm">
                        Open
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </Link>
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
