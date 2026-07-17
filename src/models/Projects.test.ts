import { describe, expect, it } from "vitest";
import { Project } from "./Projects.js";

describe("Projects model", () => {
  it("richiede il campo name", async () => {
    const doc = new Project({});
    await expect(doc.validate()).rejects.toThrow(/name/);
  });

  it("accetta un progetto valido con solo name", async () => {
    const doc = new Project({ name: "test-project" });
    await expect(doc.validate()).resolves.not.toThrow();
  });

  it("ha default vuoti per link, image, description e readme", () => {
    const doc = new Project({ name: "test-project" });
    expect(doc.link).toBe("");
    expect(doc.image).toBe("");
    expect(doc.description).toBe("");
    expect(doc.readme).toBe("");
  });

  it("accetta un array di tecnologie", async () => {
    const doc = new Project({
      name: "test-project",
      technologies: ["react", "typescript"],
    });
    await expect(doc.validate()).resolves.not.toThrow();
    expect(doc.technologies).toEqual(["react", "typescript"]);
  });

  it("ha il vincolo unique sul campo name", () => {
    const namePath = Project.schema.path("name");
    expect(namePath.options.unique).toBe(true);
  });

  it("ha timestamps abilitati", () => {
    expect(Project.schema.options.timestamps).toBe(true);
  });
});
