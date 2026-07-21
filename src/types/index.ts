export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
}

export interface PackageJson {
  name: string;
  description: string;
  technologies: string[];
  createdAt?: string;
}

export interface ProjectData {
  name: string;
  description: string;
  images: string[];
  technologies: string[];
  createdAt?: Date;
  readme: string;
}

export interface SyncResult {
  totalProjects: number;
  syncedProjects: number;
  errors: string[];
  projects: string[];
}
