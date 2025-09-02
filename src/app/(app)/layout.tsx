import { ImportsProvider } from "@/components/provider/importsProvider";
import { ProjectsProvider } from "@/components/provider/projectsProvider";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ImportsProvider>
      <ProjectsProvider>{children}</ProjectsProvider>
    </ImportsProvider>
  );
}
