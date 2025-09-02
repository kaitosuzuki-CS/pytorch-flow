"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/components/projectForm";
import { useToast } from "@/hooks/use-toast";
import { projects } from "@/data/projects.json";
import { ArrowLeft } from "lucide-react";
import { Header } from "../components/header";
import Subheader from "../components/subheader";
import { ScrollArea } from "../ui/scroll-area";

export default function SettingsScreen({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Project not found.</p>
      </div>
    );
  }

  const handleUpdateProject = (data: {
    name: string;
    description?: string | undefined;
    visibility: "public" | "private";
  }) => {
    // In a real application, you would send this data to your backend to update the project.
    console.log("Updating project:", { id: project.id, ...data });

    toast({
      title: "Project Updated",
      description: `Your project "${data.name}" has been updated.`,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background" suppressHydrationWarning>
      <Header isDashboard={true} />
      <main className="flex-1 flex flex-col py-8 px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col w-full h-full px-8">
          <Subheader
            title="Project Settings"
            buttonTitle="Back to Dashboard"
            buttonLink="//dashboard"
            ClickIcon={ArrowLeft}
          />
          <ScrollArea className="flex-grow pr-4">
            <ProjectForm
              onSubmit={handleUpdateProject}
              defaultValues={{
                name: project.name,
                description: project.description,
                visibility: project.visibility as "public" | "private",
              }}
            />
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}
