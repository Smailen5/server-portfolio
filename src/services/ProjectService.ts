import fs from "fs";
import path from "path";
import { appLogger } from "../config/appLogger.js";
import { env } from "../config/index.js";
import { Project, type IProject } from "../models/Projects.js";

export function createProjectService() {
  return {
    create: async (data: Partial<IProject>): Promise<IProject> => {
      return await Project.create(data);
    },

    getAll: async (): Promise<IProject[]> => {
      return await Project.find().sort({ createdAt: -1 });
    },

    getById: async (id: string): Promise<IProject | null> => {
      return await Project.findOne({ _id: id });
    },

    update: async (
      id: string,
      data: Partial<IProject>
    ): Promise<IProject | null> => {
      return await Project.findOneAndUpdate({ _id: id }, data, {
        returnDocument: "after",
      });
    },

    delete: async (id: string): Promise<IProject | null> => {
      const project = await Project.findOneAndDelete({ _id: id });

      if (project && Array.isArray(project.images)) {
        for (const imageUrl of project.images) {
          try {
            const filename = path.basename(imageUrl);
            const filePath = path.join(env.screenshotsDir, filename);
            await fs.promises.unlink(filePath);
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Errore sconosciuto";
            appLogger.warn(
              `Impossibile eliminare l'immagine ${imageUrl}: ${message}`
            );
          }
        }
      }

      return project;
    },

    upsert: async (
      name: string,
      data: Partial<IProject>
    ): Promise<IProject> => {
      const existing = await Project.findOne({ name });
      if (existing) {
        // Esclude createdAt dai dati di aggiornamento per preservare la data di
        // creazione originale del progetto. La variabile viene destrutturata per
        // rimuoverla da updateData; ESLint la segnala come unused perché non viene
        // usata esplicitamente, ma la sua esclusione è intenzionale.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, ...updateData } = data;
        return (await Project.findOneAndUpdate({ name }, updateData, {
          returnDocument: "after",
        }))!;
      }
      return await Project.create(data);
    },
  };
}

export type ProjectService = ReturnType<typeof createProjectService>;
