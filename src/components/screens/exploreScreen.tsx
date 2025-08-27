"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectList } from "../components/projectList";
import { projects as allProjects } from "@/data/projects.json";
import { Project } from "@/lib/type";
import { Header } from "./header";
import { useAuth } from "@/hooks/use-auth";

export default function ExploreScreen() {
  const { user } = useAuth();
  const publicProjects = allProjects.filter(
    (project) => project.visibility === "public"
  );

  const handleOpenProject = () => {};

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Header />
      <div className="py-10 px-12">
        <div className="flex items-center justify-between px-8">
          <h1 className="text-3xl font-bold font-headline">
            Explore Public Projects
          </h1>
          <Link href={user ? "/dashboard" : "/"} passHref>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {user ? "Dashboard" : "Home"}
            </Button>
          </Link>
        </div>
        <div className="p-4">
          <ProjectList
            projects={publicProjects as Project[]}
            onOpenProject={handleOpenProject}
            isImportContext={false}
          />
        </div>
      </div>
    </div>
  );
}
