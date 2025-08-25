
"use client";

import { useRouter } from 'next/navigation';
import { ProjectForm } from '@/components/project/ProjectForm';
import { useToast } from '@/hooks/use-toast';

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateProject = (data: { name: string; description?: string; visibility: 'public' | 'private' }) => {
    // In a real application, you would send this data to your backend to create a new project.
    // For now, we'll just show a toast and redirect.
    const newProjectId = `proj-${Date.now()}`;
    console.log('Creating new project:', { id: newProjectId, ...data });
    
    toast({
      title: "Project Created",
      description: `Your new project "${data.name}" has been created.`,
    });

    // We can't dynamically add to the JSON file, so we'll redirect to the dashboard.
    // In a real app, you'd redirect to `/projects/${newProjectId}`
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold font-headline mb-6">Create New Project</h1>
      <ProjectForm onSubmit={handleCreateProject} />
    </div>
  );
}
