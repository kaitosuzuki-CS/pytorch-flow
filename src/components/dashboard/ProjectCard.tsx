"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  "data-ai-hint": string;
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="aspect-video relative">
            <Image
                src={project.imageUrl}
                alt={project.name}
                fill
                className="rounded-t-lg object-cover"
                data-ai-hint={project['data-ai-hint']}
            />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
        <CardDescription className="mt-2">{project.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link href={`/projects/${project.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            Open Project
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
