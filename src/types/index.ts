export interface GitHubContent {
  name: string;
  path: string;
  type: string;
  html_url: string;
  updated_at: string;
  download_url?: string;
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
