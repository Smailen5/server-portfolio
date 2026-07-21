import express, { NextFunction, Request, Response } from "express";
import {
  errorHandler,
  notFoundHandler,
} from "../../src/middleware/errorHandler.js";
import projectRoutes from "../../src/routes/projects/index.js";
import githubRoutes from "../../src/routes/github/index.js";
import usersRoutes from "../../src/routes/users/index.js";

export function createTestApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/projects", projectRoutes);
  app.use("/api/github", githubRoutes);
  app.use("/api/users", usersRoutes);

  app.all("/{*splat}", notFoundHandler);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
  });

  return app;
}
