"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Settings } from 'lucide-react';
import type { Project } from '@/lib/type';
import { Badge } from '../ui/badge';

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
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
          <Badge variant={project.visibility === 'public' ? 'secondary' : 'outline'}>
            {project.visibility.charAt(0).toUpperCase() + project.visibility.slice(1)}
          </Badge>
        </div>
        <CardDescription className="mt-2">{project.description}</CardDescription>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/projects/${project.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full">
            Open Project
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link href={`/projects/${project.id}/settings`} passHref>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
            <span className="sr-only">Project Settings</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
