import fs from "fs";
import path from "path";
import sharp from "sharp";
import { appLogger } from "../config/appLogger.js";
import { env } from "../config/index.js";

export function createImageService() {
  const screenshotsDir = env.screenshotsDir;

  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  return {
    downloadAndConvert: async (
      url: string,
      repoName: string
    ): Promise<string | null> => {
      try {
        const parsedUrl = new URL(url);
        const originalName = path.parse(path.basename(parsedUrl.pathname)).name;
        const filename = `${repoName}-${originalName}.webp`;
        const filePath = path.join(screenshotsDir, filename);
        const publicUrl = `/screenshots/${filename}`;

        if (fs.existsSync(filePath)) {
          return publicUrl;
        }

        const response = await fetch(url);
        if (!response.ok) {
          appLogger.warn(
            `Download fallito per ${url}: ${response.status} ${response.statusText}`
          );
          return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await sharp(buffer).webp().toFile(filePath);

        return publicUrl;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Errore sconosciuto";
        appLogger.warn(`Errore conversione immagine ${url}: ${message}`);
        return null;
      }
    },
  };
}

export type ImageService = ReturnType<typeof createImageService>;
