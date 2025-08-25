
"use client";
import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/project/ProjectForm';
import { useToast } from '@/hooks/use-toast';
import { projects } from '@/data/projects.json';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Project not found.</p>
        </div>
    )
  }

  const handleUpdateProject = (data: { name: string; description: string; visibility: 'public' | 'private' }) => {
    // In a real application, you would send this data to your backend to update the project.
    console.log('Updating project:', { id: project.id, ...data });
    
    toast({
      title: "Project Updated",
      description: `Your project "${data.name}" has been updated.`,
    });

    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
       <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold font-headline">Project Settings</h1>
        <Link href={`/projects/${params.id}`} passHref>
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
        </Link>
      </div>
      <ProjectForm 
        onSubmit={handleUpdateProject} 
        defaultValues={{
          name: project.name,
          description: project.description,
          visibility: project.visibility,
        }} 
      />
    </div>
  );
}
