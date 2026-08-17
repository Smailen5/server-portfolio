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
  version: string;
}

export interface ProjectData {
  name: string;
  repoName: string;
  repoUrl: string;
  description: string;
  images: string[];
  technologies: string[];
  createdAt?: Date;
  readme: string;
  version: string;
}

export interface SyncResult {
  totalProjects: number;
  syncedProjects: number;
  errors: string[];
  projects: string[];
}

export interface ProjectResponse {
  name: string;
  description: string;
  technologies: string[];
  imagesUrl: string[];
  repoUrl: string;
  version: string;
  createdAt: string;
  readmeContent: string;
}
