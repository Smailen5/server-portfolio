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
      return await Project.findOneAndDelete({ _id: id });
    },

    upsert: async (
      name: string,
      data: Partial<IProject>
    ): Promise<IProject> => {
      const existing = await Project.findOne({ name });
      if (existing) {
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
