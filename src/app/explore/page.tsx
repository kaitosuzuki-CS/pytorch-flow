
"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project } from '@/lib/type';
import { projects as allProjects } from '@/data/projects.json';
import { ProjectList } from '@/components/explore/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExplorePage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const publicProjects = allProjects.filter(p => p.visibility === 'public') as unknown as Project[];
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Explore Public Projects</h1>
        <Link href={projectId ? `/projects/${projectId}`: "/"} passHref>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {projectId ? 'Project' : 'Dashboard'}
          </Button>
        </Link>
      </div>
      <ProjectList 
        projects={publicProjects} 
        onProjectSelect={setSelectedProject}
        isImportContext={!!projectId}
      />
    </div>
  );
}
