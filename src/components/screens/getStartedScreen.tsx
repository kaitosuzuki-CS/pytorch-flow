"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Workflow } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiGoogle as GoogleIcon, SiGithub as GithubIcon } from "react-icons/si";
import { Header } from "../components/header";

export default function GetStartedScreen() {
  const { signInWithGoogle, signInWithGithub } = useAuth();
  const { toast } = useToast();

  const router = useRouter();

  const handleSignIn = async (provider: string) => {
    try {
      if (provider === "google") {
        await signInWithGoogle();
      } else if (provider === "github") {
        await signInWithGithub();
      }

      router.push("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "An unknown error occurred during authentication",
      });
    }
  };
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <div className="flex flex-col h-full items-center justify-center bg-muted/40 p-4">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">
                Get Started
              </CardTitle>
              <CardDescription>
                Sign in to your account to continue.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button variant="outline" onClick={() => handleSignIn("google")}>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Sign in with Google
              </Button>
              <Button variant="outline" onClick={() => handleSignIn("github")}>
                <GithubIcon className="mr-2 h-5 w-5" />
                Sign in with GitHub
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
