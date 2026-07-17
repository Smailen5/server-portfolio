import { describe, expect, it } from "vitest";
import { User } from "./User.js";

describe("User model", () => {
  it("richiede i campi name, email, password e role", async () => {
    const doc = new User({});
    await expect(doc.validate()).rejects.toThrow();
  });

  it("accetta un utente valido con tutti i campi obbligatori", async () => {
    const doc = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "admin",
    });
    await expect(doc.validate()).resolves.not.toThrow();
  });

  it("rifiuta un role non valido", async () => {
    const doc = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "superadmin",
    });
    await expect(doc.validate()).rejects.toThrow(/role/);
  });

  it("accetta solo i role admin e user", async () => {
    const admin = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "admin",
    });
    const user = new User({
      name: "User",
      email: "user@example.com",
      password: "hashedpassword",
      role: "user",
    });
    await expect(admin.validate()).resolves.not.toThrow();
    await expect(user.validate()).resolves.not.toThrow();
  });

  it("ha default isActive a true", () => {
    const doc = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "admin",
    });
    expect(doc.isActive).toBe(true);
  });

  it("ha default lastLogin a Date.now", () => {
    const before = Date.now();
    const doc = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "hashedpassword",
      role: "admin",
    });
    const after = Date.now();
    expect(doc.lastLogin!.getTime()).toBeGreaterThanOrEqual(before);
    expect(doc.lastLogin!.getTime()).toBeLessThanOrEqual(after);
  });

  it("ha il vincolo unique sul campo email", () => {
    const emailPath = User.schema.path("email");
    expect(emailPath.options.unique).toBe(true);
  });

  it("ha select false sul campo password", () => {
    const passwordPath = User.schema.path("password");
    expect(passwordPath.options.select).toBe(false);
  });

  it("ha timestamps abilitati", () => {
    expect(User.schema.options.timestamps).toBe(true);
  });
});
