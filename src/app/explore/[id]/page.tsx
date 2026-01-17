import ProjectScreen from "@/components/screens/projectScreen";
import { use } from "react";
import { Project } from "@/lib/type";

export default function ExploreProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ProjectScreen projectId={id} />;
}
