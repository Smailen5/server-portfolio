import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockStop, mockSchedule, mockSyncService } = vi.hoisted(() => {
  const mockStop = vi.fn();
  const mockSchedule = vi.fn(() => ({ stop: mockStop }));
  const mockSyncService = {
    syncAll: vi.fn(),
  };
  return { mockStop, mockSchedule, mockSyncService };
});

vi.mock("node-cron", () => ({
  default: {
    schedule: mockSchedule,
  },
}));

vi.mock("./SyncService.js", () => ({
  createSyncService: vi.fn(() => mockSyncService),
}));

vi.mock("../config/appLogger.js", () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const mockEnv = vi.hoisted(() => ({
  syncCron: "0 * * * *",
}));

vi.mock("../config/index.js", () => ({
  env: mockEnv,
}));

import { createSchedulerService } from "./SchedulerService.js";
import { appLogger } from "../config/appLogger.js";

describe("SchedulerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("start", () => {
    it("registra il job cron con l'espressione configurata", () => {
      const scheduler = createSchedulerService();
      scheduler.start();

      expect(mockSchedule).toHaveBeenCalledWith(
        "0 * * * *",
        expect.any(Function)
      );
    });

    it("non registra il job due volte", () => {
      const scheduler = createSchedulerService();
      scheduler.start();
      scheduler.start();

      expect(mockSchedule).toHaveBeenCalledTimes(1);
    });

    it("esegue syncAll quando il cron triggera", async () => {
      mockSyncService.syncAll.mockResolvedValue({
        totalProjects: 5,
        syncedProjects: 5,
        errors: [],
        projects: ["fm-1", "fm-2"],
      });

      const scheduler = createSchedulerService();
      scheduler.start();

      const cronJob = mockSchedule.mock.calls[0][1];
      await cronJob();

      expect(mockSyncService.syncAll).toHaveBeenCalled();
    });

    it("logga inizio e fine sync", async () => {
      mockSyncService.syncAll.mockResolvedValue({
        totalProjects: 2,
        syncedProjects: 2,
        errors: [],
        projects: ["fm-1", "fm-2"],
      });

      const scheduler = createSchedulerService();
      scheduler.start();

      const cronJob = mockSchedule.mock.calls[0][1];
      await cronJob();

      expect(appLogger.info).toHaveBeenCalledWith("Sync automatica iniziata");
      expect(appLogger.info).toHaveBeenCalledWith(
        "Sync automatica completata: 2/2 progetti"
      );
    });

    it("logga errori sync se presenti", async () => {
      mockSyncService.syncAll.mockResolvedValue({
        totalProjects: 2,
        syncedProjects: 1,
        errors: ["Errore repo 1"],
        projects: ["fm-1", "fm-2"],
      });

      const scheduler = createSchedulerService();
      scheduler.start();

      const cronJob = mockSchedule.mock.calls[0][1];
      await cronJob();

      expect(appLogger.warn).toHaveBeenCalledWith("Errori sync: Errore repo 1");
    });

    it("non crasha se syncAll fallisce", async () => {
      mockSyncService.syncAll.mockRejectedValue(new Error("GitHub API down"));

      const scheduler = createSchedulerService();
      scheduler.start();

      const cronJob = mockSchedule.mock.calls[0][1];
      await cronJob();

      expect(appLogger.error).toHaveBeenCalledWith(
        "Sync automatica fallita:",
        expect.any(Error)
      );
    });
  });

  describe("stop", () => {
    it("ferma il job cron", () => {
      const scheduler = createSchedulerService();
      scheduler.start();
      scheduler.stop();

      expect(mockStop).toHaveBeenCalled();
    });

    it("non crasha se stop chiamato senza start", () => {
      const scheduler = createSchedulerService();
      expect(() => scheduler.stop()).not.toThrow();
    });
  });
});
