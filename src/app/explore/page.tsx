
"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Project } from '@/lib/type';
import { projects as allProjects } from '@/data/projects.json';
import { ProjectList } from '@/components/explore/ProjectList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const publicProjects = allProjects.filter(p => p.visibility === 'public') as unknown as Project[];
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) {
      return publicProjects;
    }

    const searchWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

    const rankedProjects = publicProjects.map(project => {
      let score = 0;
      const name = project.name.toLowerCase();
      const description = project.description?.toLowerCase() || '';

      searchWords.forEach(word => {
        if (name.includes(word)) {
          score += 2; // Higher weight for title matches
        }
        if (description.includes(word)) {
          score += 1;
        }
      });

      return { ...project, score };
    })
    .filter(project => project.score > 0)
    .sort((a, b) => b.score - a.score);

    return rankedProjects;
  }, [searchQuery, publicProjects]);

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
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
        />
      </div>
      <ProjectList 
        projects={filteredProjects} 
        onProjectSelect={setSelectedProject}
        isImportContext={!!projectId}
      />
    </div>
  );
}
