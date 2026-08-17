import { describe, expect, it } from "vitest";
import { Project } from "./Projects.js";

describe("Projects model", () => {
  it("richiede il campo name", async () => {
    const doc = new Project({
      repoName: "fm-test-project",
    });
    await expect(doc.validate()).rejects.toThrow(/name/);
  });

  it("richiede il campo repoName", async () => {
    const doc = new Project({ name: "test-project" });
    await expect(doc.validate()).rejects.toThrow(/repoName/);
  });

  it("accetta un progetto valido con name e repoName", async () => {
    const doc = new Project({
      repoName: "fm-test-project",
      name: "test-project",
    });
    await expect(doc.validate()).resolves.not.toThrow();
  });

  it("ha default vuoti per repoUrl, images, description e readme", () => {
    const doc = new Project({
      repoName: "fm-test-project",
      name: "test-project",
    });
    expect(doc.repoUrl).toBe("");
    expect(doc.images).toEqual([]);
    expect(doc.description).toBe("");
    expect(doc.readme).toBe("");
  });

  it("accetta un array di tecnologie", async () => {
    const doc = new Project({
      repoName: "fm-test-project",
      name: "test-project",
      technologies: ["react", "typescript"],
    });
    await expect(doc.validate()).resolves.not.toThrow();
    expect(doc.technologies).toEqual(["react", "typescript"]);
  });

  it("ha il vincolo unique sul campo repoName", () => {
    const namePath = Project.schema.path("repoName");
    expect(namePath.options.unique).toBe(true);
  });

  it("ha timestamps abilitati", () => {
    expect(Project.schema.options.timestamps).toBe(true);
  });
});
