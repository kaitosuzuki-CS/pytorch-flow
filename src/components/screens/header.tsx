"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Download,
  Workflow,
  MousePointer,
  Move,
  Upload,
  ChevronRight,
  LogOut,
  Router,
  Plus,
  Compass,
} from "lucide-react";
import { InteractionMode, Project } from "@/lib/type";
import { Badge } from "../ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Separator } from "../ui/separator";

type HeaderProps = {
  isDashboard?: boolean | null;
  project?: Project | null;
  interactionMode?: InteractionMode | null;
  onInteractionModeChange?: (mode: InteractionMode) => void;
};

export function Header({
  isDashboard,
  project,
  interactionMode,
  onInteractionModeChange,
}: HeaderProps) {
  const { user, logOut } = useAuth();
  const router = useRouter();

  const toggleInteractionMode = () => {
    if (!onInteractionModeChange) return;

    onInteractionModeChange(
      interactionMode === "selection" ? "pan" : "selection"
    );
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-background border-b z-20">
      <div className="flex items-center gap-3 min-w-0">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Workflow className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground hidden sm:block">
            {isDashboard ? "My Projects" : "FlowForge"}
          </h1>
        </Link>
        {project && (
          <>
            <ChevronRight className="w-6 h-6 text-muted-foreground" />
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-lg truncate">
                {project.name}
              </span>
              <Badge
                variant={
                  project.visibility === "public" ? "secondary" : "outline"
                }
              >
                {project.visibility.charAt(0).toUpperCase() +
                  project.visibility.slice(1)}
              </Badge>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {project && (
          <Button
            onClick={toggleInteractionMode}
            variant="outline"
            size="icon"
            title={
              interactionMode === "selection"
                ? "Switch to Pan Mode"
                : "Switch to Selection Mode"
            }
          >
            {interactionMode === "selection" ? (
              <MousePointer className="w-6 h-6" />
            ) : (
              <Move className="w-6 h-6" />
            )}
          </Button>
        )}

        {isDashboard && (
          <>
            <Link href="/explore">
              <Button variant="outline">
                <Compass className="w-4 h-4 mr-2" />
                Browse Projects
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </Link>
          </>
        )}

        <div className="flex flex-1 items-center justify-end space-x-2 mr-4">
          {user ? (
            <>
              <Separator orientation="vertical" className="h-6" />
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/get-started">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
