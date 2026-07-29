import { describe, expect, it, vi } from "vitest";
import { healthCheck } from "./healthCheck";

function mockReqRes() {
  const req = {} as any;
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

describe("healthCheck", () => {
  it("restituisce status ok con codice 200", () => {
    const { req, res, next } = mockReqRes();

    healthCheck(req, res, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "ok" });
  });
});
