
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { projects } from '@/data/projects.json';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Plus, Compass } from 'lucide-react';
import { Project } from '@/lib/type';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between h-16 px-6 bg-card border-b">
        <h1 className="text-2xl font-bold font-headline text-foreground">
          My Projects
        </h1>
        <div className="flex items-center gap-2">
            <Link href="/explore">
              <Button variant="outline">
                <Compass className="w-4 h-4 mr-2" />
                Browse Projects
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
        </div>
      </header>
      <main className="p-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project as unknown as Project} />
          ))}
        </div>
      </main>
    </div>
  );
}
