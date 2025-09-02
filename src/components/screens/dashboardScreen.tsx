"use client";

import { Plus, Compass, Router } from "lucide-react";
import { Project } from "@/lib/type";
import { ProjectList } from "../components/projectList";
import { useRouter } from "next/navigation";
import { Header } from "../components/header";
import Subheader from "../components/subheader";
import { useProjects } from "@/hooks/use-projects";

export default function DashboardScreen() {
  const router = useRouter();
  const { projects } = useProjects();

  const handleOpenProject = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      className="flex flex-col h-screen bg-background"
      suppressHydrationWarning
    >
      <Header isDashboard={true} />
      <main className="flex-1 flex flex-col py-8 px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col w-full h-full px-8">
          <Subheader
            title="My Projects"
            buttonTitle="New Project"
            buttonLink="/projects/new"
            ClickIcon={Plus}
          />
          <ProjectList
            projects={projects}
            onOpenProject={handleOpenProject}
            pageType="dashboard"
          />
        </div>
      </main>
    </div>
  );
}
