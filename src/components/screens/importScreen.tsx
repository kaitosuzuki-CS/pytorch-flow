"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectList } from "../components/projectList";
import { projects as allProjects } from "@/data/projects.json";
import { ImportedProject, Project } from "@/lib/type";
import { Header } from "../components/header";
import { useAuth } from "@/hooks/use-auth";
import Subheader from "../components/subheader";
import { useRouter } from "next/navigation";
import { useImports } from "@/hooks/use-imports";
import { useEffect } from "react";

interface ImportScreenProps {
  id: string;
  projects: Project[];
}

export default function ImportScreen({ id, projects }: ImportScreenProps) {
  const { user } = useAuth();
  const { importedProjects, addImportedProjects } = useImports();
  const router = useRouter();

  const handleOpenProject = (project: Project) => {
    router.push(`/explore/${project.id}`);
  };

  const handleImport = (project: ImportedProject) => {
    addImportedProjects(project);
  };

  return (
    <div className="flex flex-col h-screen" suppressHydrationWarning>
      <Header />
      <main className="flex-1 flex flex-col py-8 px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col w-full h-full px-8">
          <Subheader
            title="Explore Public Projects"
            buttonTitle={`Back to Project`}
            buttonLink={`/projects/${id}`}
            ClickIcon={ArrowLeft}
          />
          <ProjectList
            projects={projects}
            onOpenProject={handleOpenProject}
            pageType="import"
            onImportProject={handleImport}
            importedProjects={importedProjects}
          />
        </div>
      </main>
    </div>
  );
}
