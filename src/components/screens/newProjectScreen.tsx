"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/components/projectForm";
import { useToast } from "@/hooks/use-toast";
import { uuidv7 as uuid } from "uuidv7";
import { Header } from "../components/header";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Subheader from "../components/subheader";
import { Project } from "@/lib/type";
import { useImports } from "@/hooks/use-imports";
import { useProjects } from "@/hooks/use-projects";
import { useAuth } from "@/hooks/use-auth";

export default function NewProjectScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addProject } = useProjects();

  const { toast } = useToast();

  const handleCreateProject = (data: {
    name: string;
    description?: string;
    visibility: "public" | "private";
  }) => {
    if (!user) return;
    // In a real application, you would send this data to your backend to create a new project.
    // For now, we'll just show a toast and redirect.
    const newProjectId = uuid();

    const newProject: Project = {
      uid: user.uid,
      id: newProjectId,
      name: data.name,
      description: data.description || "",
      visibility: data.visibility,
    };

    addProject(newProject);

    toast({
      title: "Project Created",
      description: `Your new project "${data.name}" has been created.`,
    });

    router.push("/dashboard");
  };

  return (
    <div
      className="flex flex-col h-screen bg-background"
      suppressHydrationWarning
    >
      <Header isDashboard={false} />
      <main className="flex-1 flex flex-col py-8 px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col w-full h-full px-8">
          <Subheader
            title="Create New Project"
            buttonTitle="Back to Dashboard"
            buttonLink="/dashboard"
            ClickIcon={ArrowLeft}
          />
          <ScrollArea className="flex-grow pr-4">
            <ProjectForm onSubmit={handleCreateProject} />
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}
