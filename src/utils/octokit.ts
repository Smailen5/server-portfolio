import { Octokit } from 'octokit';
import { env } from '../config';

let instance: Octokit | null = null;

export const getOctokitInstance = (): Octokit => {
  if (!instance) {
    instance = new Octokit({ auth: env.githubToken });
  }
  return instance;
};
