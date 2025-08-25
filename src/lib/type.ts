
export type InteractionMode = "selection" | "pan";

export interface Project {
    id: string;
    name: string;
    description: string;
    visibility: 'public' | 'private';
    imageUrl: string;
    "data-ai-hint": string;
  }
