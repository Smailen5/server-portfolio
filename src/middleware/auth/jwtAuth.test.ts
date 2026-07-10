import { describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { AppError } from "../errorHandler";
import { jwtAuth } from "./jwtAuth";

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// Sostituiamo appLogger per evitare output nei test
vi.mock("../../config/appLogger", () => ({
  appLogger: { warn: vi.fn(), error: vi.fn() },
}));

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { headers: {} } as any;
  // mockReturnThis() permette il chaining: res.status(401).json(...)
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any;
  const next = vi.fn();
  return { req, res, next };
}

// ──────────────────────────────────────────────
// Test per jwtAuth
// ──────────────────────────────────────────────
// jwtAuth controlla il token JWT nell'header Authorization:
// - se mancante → 401 "Accesso non autorizzato"
// - se invalido/scaduto → 401 "Token non valido"
// - se valido → setta req.user e chiama next()

describe("jwtAuth", () => {
  it("chiama next con AppError quando token mancante", () => {
    const { req, res, next } = mockReqRes();

    jwtAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Accesso non autorizzato, token mancante",
        statusCode: 401,
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("chiama next con AppError quando token non valido", () => {
    const { req, res, next } = mockReqRes();
    req.headers.authorization = "Bearer invalid-token";
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    jwtAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Token non valido",
        statusCode: 401,
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("setta req.user e chiama next() con token valido", () => {
    const { req, res, next } = mockReqRes();
    req.headers.authorization = "Bearer valid-token";
    const decoded = { id: "user123", iat: 123 };
    // jwt.verify restituisce il payload decodificato
    vi.spyOn(jwt, "verify").mockReturnValue(decoded as any);

    jwtAuth(req, res, next);

    // Il middleware deve salvare il decoded su req.user
    expect(req.user).toEqual(decoded);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("chiama next con AppError quando token scaduto", () => {
    const { req, res, next } = mockReqRes();
    req.headers.authorization = "Bearer expired-token";
    vi.spyOn(jwt, "verify").mockImplementation(() => {
      const err: any = new Error("jwt expired");
      err.name = "TokenExpiredError";
      throw err;
    });

    jwtAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Token non valido",
        statusCode: 401,
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
