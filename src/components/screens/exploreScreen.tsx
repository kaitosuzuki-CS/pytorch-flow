"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProjectList } from "../components/projectList";
import { Project } from "@/lib/type";
import { Header } from "../components/header";
import { useAuth } from "@/hooks/use-auth";
import Subheader from "../components/subheader";
import { useRouter } from "next/navigation";
import { getDocs, query, where } from "firebase/firestore";
import { projectsRef } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { useProjects } from "@/hooks/use-projects";

export default function ExploreScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [explorableProjects, setExplorableProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects();
  }, []);

  const getProjects = async () => {
    try {
      const docRef = query(projectsRef, where("visibility", "==", "public"));
      const data = await getDocs(docRef);

      const documents = data.docs
        .map(
          (doc) =>
            ({
              ...doc.data(),
            }) as Project,
        )
        .filter((p) => !user || user.uid !== p.uid);

      setExplorableProjects(documents);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenProject = (project: Project) => {
    router.push(`/explore/${project.id}`);
  };

  return (
    <div className="flex flex-col h-screen" suppressHydrationWarning>
      <Header />
      <main className="flex-1 flex flex-col py-8 px-4 md:px-6 overflow-hidden">
        <div className="flex flex-col w-full h-full px-8">
          <Subheader
            title="Explore Public Projects"
            buttonTitle={`Back to ${user ? "Dashboard" : "Home"}`}
            buttonLink={user ? "/dashboard" : "/"}
            ClickIcon={ArrowLeft}
          />
          <ProjectList
            projects={explorableProjects}
            onOpenProject={handleOpenProject}
            pageType="explore"
          />
        </div>
      </main>
    </div>
  );
}
