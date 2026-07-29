import { Request, RequestHandler, Response } from "express";

export const healthCheck = ((_req: Request, res: Response) => {
  return res.status(200).json({ status: "ok" });
}) as unknown as RequestHandler;
