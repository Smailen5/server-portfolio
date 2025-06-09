export interface GitHubContent {
  name: string;
  path: string;
  type: string;
  html_url: string | null;
  download_url?: string | null;
  content?: string;
}

export interface PackageJson {
  name: string;
  description: string;
  technologies: string[];
  createdAt: string;
}

export interface ProjectData {
  name: string;
  description: string;
  image: string;
  technologies: string[];
  createdAt: Date;
  readme: string;
}
