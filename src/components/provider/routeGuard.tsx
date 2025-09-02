"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function RouteGuard({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [pathname, router, user]);

  return <>{children}</>;
}
