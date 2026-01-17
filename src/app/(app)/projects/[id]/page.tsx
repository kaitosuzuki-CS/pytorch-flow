import ProjectScreen from "@/components/screens/projectScreen";
import { use } from "react";
import { Project } from "@/lib/type";
import UserProjectScreen from "@/components/screens/userProjectScreen";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <UserProjectScreen projectId={id} />;
}
