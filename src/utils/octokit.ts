import { Octokit } from "octokit";
import { env } from "../config/index.js";

let instance: Octokit | null = null;

export const getOctokitInstance = (): Octokit => {
  if (!instance) {
    instance = new Octokit({ auth: env.githubToken });
  }
  return instance;
};
