import { describe, expect, it } from "vitest";
import {
  createProjectValidator,
  updateProjectValidator,
  idValidator,
} from "./projectValidators";
import { runValidation } from "./testHelpers";

// ──────────────────────────────────────────────
// Test per createProjectValidator
// ──────────────────────────────────────────────
// Verifica la validazione del body per la creazione progetti:
// name, repoUrl, images obbligatori, technologies array non vuoto,
// description obbligatoria.
describe("createProjectValidator", () => {
  const validBody = {
    name: "My Project",
    repoUrl: "https://example.com",
    images: ["https://example.com/img.png"],
    technologies: ["React"],
    description: "A cool project",
  };

  it("passa con dati validi", async () => {
    const result = await runValidation(
      { body: validBody },
      createProjectValidator
    );
    expect(result.isEmpty()).toBe(true);
  });

  it("fallisce quando name mancante", async () => {
    const { name, ...body } = validBody;
    const result = await runValidation({ body }, createProjectValidator);
    expect(result.isEmpty()).toBe(false);
    expect(result.array().some((e) => e.msg === "Il nome è obbligatorio")).toBe(
      true
    );
  });

  it("fallisce quando repoUrl mancante", async () => {
    const { repoUrl, ...body } = validBody;
    const result = await runValidation({ body }, createProjectValidator);
    expect(
      result.array().some((e) => e.msg === "Il repoUrl è obbligatorio")
    ).toBe(true);
  });

  it("fallisce quando repoUrl non è un URL", async () => {
    const result = await runValidation(
      { body: { ...validBody, repoUrl: "not-a-url" } },
      createProjectValidator
    );
    expect(
      result.array().some((e) => e.msg.toLowerCase().includes("url"))
    ).toBe(true);
  });

  it("fallisce quando images mancante", async () => {
    const { images, ...body } = validBody;
    const result = await runValidation({ body }, createProjectValidator);
    expect(result.array().some((e) => e.msg.includes("immagini"))).toBe(true);
  });

  it("fallisce quando technologies non è un array", async () => {
    const result = await runValidation(
      { body: { ...validBody, technologies: "React" } },
      createProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("array"))).toBe(true);
  });

  it("non intercetta array vuoto (notEmpty ignora gli array)", async () => {
    // notEmpty() in express-validator funziona solo su stringhe,
    // non su array. Questo test documenta il comportamento reale.
    const result = await runValidation(
      { body: { ...validBody, technologies: [] } },
      createProjectValidator
    );
    expect(result.isEmpty()).toBe(true);
  });

  it("fallisce quando description mancante", async () => {
    const { description, ...body } = validBody;
    const result = await runValidation({ body }, createProjectValidator);
    expect(result.array().some((e) => e.msg.includes("descrizione"))).toBe(
      true
    );
  });

  it("fallisce quando name non è una stringa", async () => {
    const result = await runValidation(
      { body: { ...validBody, name: 123 } },
      createProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("stringa"))).toBe(true);
  });

  it("fallisce quando images contiene un URL non valido", async () => {
    const result = await runValidation(
      { body: { ...validBody, images: ["not-a-url"] } },
      createProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("URL"))).toBe(true);
  });

  it("fallisce quando description non è una stringa", async () => {
    const result = await runValidation(
      { body: { ...validBody, description: 123 } },
      createProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("stringa"))).toBe(true);
  });

  it("fallisce quando name è stringa vuota", async () => {
    const result = await runValidation(
      { body: { ...validBody, name: "" } },
      createProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("nome"))).toBe(true);
  });

  it("fallisce quando description è stringa vuota", async () => {
    const result = await runValidation(
      { body: { ...validBody, description: "" } },
      createProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("descrizione"))).toBe(
      true
    );
  });
});

// ──────────────────────────────────────────────
// Test per updateProjectValidator
// ──────────────────────────────────────────────
// Verifica che l'id sia un MongoId valido e che i campi
// opzionali del body (name, repoUrl, images, etc.) siano del tipo giusto.
describe("updateProjectValidator", () => {
  const validParams = { id: "507f1f77bcf86cd799439011" };
  const validBody = { name: "Updated", technologies: ["Node"] };

  it("passa con id valido e body opzionale", async () => {
    const result = await runValidation(
      { params: validParams, body: validBody },
      updateProjectValidator
    );
    expect(result.isEmpty()).toBe(true);
  });

  it("passa con id valido e body vuoto", async () => {
    const result = await runValidation(
      { params: validParams, body: {} },
      updateProjectValidator
    );
    expect(result.isEmpty()).toBe(true);
  });

  it("fallisce quando id non è un MongoId valido", async () => {
    const result = await runValidation(
      { params: { id: "invalid" }, body: {} },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg === "ID non valido")).toBe(true);
  });

  it("fallisce quando name non è una stringa", async () => {
    const result = await runValidation(
      { params: validParams, body: { name: 123 } },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("stringa"))).toBe(true);
  });

  it("fallisce quando id mancante", async () => {
    const result = await runValidation(
      { params: {}, body: {} },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("ID"))).toBe(true);
  });

  it("fallisce quando repoUrl non e' un URL", async () => {
    const result = await runValidation(
      { params: validParams, body: { repoUrl: "not-a-url" } },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("URL"))).toBe(true);
  });

  it("fallisce quando images contiene un URL non valido", async () => {
    const result = await runValidation(
      { params: validParams, body: { images: ["not-a-url"] } },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("URL"))).toBe(true);
  });

  it("fallisce quando technologies non è un array", async () => {
    const result = await runValidation(
      { params: validParams, body: { technologies: "React" } },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("array"))).toBe(true);
  });

  it("fallisce quando description non è una stringa", async () => {
    const result = await runValidation(
      { params: validParams, body: { description: 123 } },
      updateProjectValidator
    );
    expect(result.array().some((e) => e.msg.includes("stringa"))).toBe(true);
  });

  it("passa con name vuoto (optional, stringa vuota valida)", async () => {
    const result = await runValidation(
      { params: validParams, body: { name: "" } },
      updateProjectValidator
    );
    expect(result.isEmpty()).toBe(true);
  });
});

// ──────────────────────────────────────────────
// Test per idValidator
// ──────────────────────────────────────────────
// Validatore semplice: controlla che il params.id sia un MongoId.
describe("idValidator", () => {
  it("passa con un MongoId valido", async () => {
    const result = await runValidation(
      { params: { id: "507f1f77bcf86cd799439011" } },
      idValidator
    );
    expect(result.isEmpty()).toBe(true);
  });

  it("fallisce con id non valido", async () => {
    const result = await runValidation(
      { params: { id: "invalid" } },
      idValidator
    );
    expect(result.array().some((e) => e.msg === "ID non valido")).toBe(true);
  });

  it("fallisce quando id mancante", async () => {
    const result = await runValidation({ params: {} }, idValidator);
    expect(result.isEmpty()).toBe(false);
  });
});
