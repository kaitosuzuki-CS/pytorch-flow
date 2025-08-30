import ProjectScreen from "@/components/screens/projectScreen";
import { use } from "react";
import { projects as allProjects } from "@/data/projects.json";
import { Project } from "@/lib/type";

export default function ExploreProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const project = allProjects.filter((p) => p.id === id)[0];

  return (
    <ProjectScreen project={project as unknown as Project} isViewOnly={true} />
  );
}
