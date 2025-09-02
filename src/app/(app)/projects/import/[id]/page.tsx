import ImportScreen from "@/components/screens/importScreen";
import { useImports } from "@/hooks/use-imports";
import { use } from "react";
import { projects as allProjects } from "@/data/projects.json";
import { ImportedProject, Project } from "@/lib/type";

export default function ImportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ImportScreen id={id} projects={allProjects as Project[]} />;
}
