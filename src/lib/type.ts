import type { Node, Edge } from "reactflow";

export type InteractionMode = "selection" | "pan";

export interface Project {
  uid: string;
  id: string;
  name: string;
  description: string;
  visibility: "public" | "private";
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
