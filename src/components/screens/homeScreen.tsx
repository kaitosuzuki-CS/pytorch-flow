"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Workflow } from "lucide-react";
import { Header } from "../components/header";

export default function HomeScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <section className="max-w-3xl">
          <h2 className="text-5xl font-bold font-headline tracking-tight">
            Create and Collaborate on Flowcharts, Seamlessly
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            FlowForge is the ultimate platform for designing, sharing, and
            managing your process diagrams. From simple workflows to complex
            systems, bring your ideas to life.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/get-started">
              <Button size="lg">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline">
                Explore Projects
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="p-6 border-t text-center text-sm text-muted-foreground">
        © 2025 FlowForge, Inc. All rights reserved.
      </footer>
    </div>
  );
}
