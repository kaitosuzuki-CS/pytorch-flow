import { ImportsProvider } from "@/components/provider/importsProvider";
import { ProjectsProvider } from "@/components/provider/projectsProvider";
import RouteGuard from "@/components/provider/routeGuard";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <ImportsProvider>
        <ProjectsProvider>{children}</ProjectsProvider>
      </ImportsProvider>
    </RouteGuard>
  );
}
