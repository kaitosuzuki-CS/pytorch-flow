import { ImportsProvider } from "@/components/provider/importsProvider";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return <ImportsProvider>{children}</ImportsProvider>;
}
