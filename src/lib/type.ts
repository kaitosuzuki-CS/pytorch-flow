
import type { Node, Edge } from 'reactflow';

export type InteractionMode = "selection" | "pan";

export interface Project {
    id: string;
    name: string;
    description: string;
    visibility: 'public' | 'private';
    imageUrl: string;
    "data-ai-hint": string;
    nodes?: Node[];
    edges?: Edge[];
  }

  export interface ImportedProject {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
  }
