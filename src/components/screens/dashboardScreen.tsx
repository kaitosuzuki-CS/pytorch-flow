"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects.json";
import { Plus, Compass, Router } from "lucide-react";
import { Project } from "@/lib/type";
import { ProjectList } from "../components/projectList";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "../components/header";
import Subheader from "../components/subheader";

export default function DashboardScreen() {
  const router = useRouter();

  const { user } = useAuth();
  console.log(user);

  const handleOpenProject = (project: Project) => {
    router.push(`/app/projects/${project.id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background" suppressHydrationWarning>
      <Header isDashboard={true} />
      <main className="flex-1 flex flex-col py-8 px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col w-full h-full px-8">
          <Subheader
            title="My Projects"
            buttonTitle="New Project"
            buttonLink="/app/projects/new"
            ClickIcon={Plus}
          />
          <ProjectList
            projects={projects as Project[]}
            onOpenProject={handleOpenProject}
            pageType='dashboard'
          />
        </div>
      </main>
    </div>
  );
}
