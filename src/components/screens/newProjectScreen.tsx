"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/components/projectForm";
import { useToast } from "@/hooks/use-toast";
import { uuidv7 as uuid } from "uuidv7";
import { Header } from "../components/header";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import Subheader from "../components/subheader";

export default function NewProjectScreen() {
  const router = useRouter();
  const { toast } = useToast();

  const handleCreateProject = (data: {
    name: string;
    description?: string;
    visibility: "public" | "private";
  }) => {
    // In a real application, you would send this data to your backend to create a new project.
    // For now, we'll just show a toast and redirect.
    const newProjectId = uuid();
    console.log("Creating new project:", { id: newProjectId, ...data });

    toast({
      title: "Project Created",
      description: `Your new project "${data.name}" has been created.`,
    });

    router.push("/app/dashboard");
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
            buttonLink="/app/dashboard"
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
