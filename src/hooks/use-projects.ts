"use client";

import { ProjectsContext, ProjectsContextType } from "@/components/provider/projectsProvider";
import { useContext } from "react";

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useImports must be used within an AuthProvider");
  }
  return context;
};
