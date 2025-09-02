import { use } from "react";
import SettingsScreen from "@/components/screens/settingsScreen";

export default function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <SettingsScreen projectId={id} />;
}
