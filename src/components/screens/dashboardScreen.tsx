"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { projects } from "@/data/projects.json";
import { Plus, Compass, Router } from "lucide-react";
import { Project } from "@/lib/type";
import { ProjectList } from "../components/projectList";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Header } from "./header";

export default function DashboardScreen() {
  const router = useRouter();

  const { user } = useAuth();
  console.log(user);

  const handleOpenProject = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header isDashboard={true}/>
      <main className="p-8">
        <ProjectList
          projects={projects as Project[]}
          onOpenProject={handleOpenProject}
          isImportContext={false}
        />
      </main>
    </div>
  );
}
