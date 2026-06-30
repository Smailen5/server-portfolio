import { describe, expect, it } from 'vitest'
import { validationResult } from 'express-validator'
import { validateLoginInput } from './authValidators'

// ──────────────────────────────────────────────
// Helper: esegue ogni validatore sul req e restituisce i risultati
// ──────────────────────────────────────────────
// express-validator funziona in modo diverso dai middleware normali:
// ogni validatore va eseguito manualmente con v.run(req), poi si
// controllano gli errori con validationResult(req).
async function runValidation(req: Record<string, unknown>, validations: typeof validateLoginInput) {
  for (const v of validations) {
    await v.run(req)
  }
  return validationResult(req)
}

// ──────────────────────────────────────────────
// Test per validateLoginInput
// ──────────────────────────────────────────────
// Valida i campi email e password per il login:
// email obbligatoria e formato valido, password almeno 6 caratteri.
describe('validateLoginInput', () => {
  it('passa con email e password validi', async () => {
    const result = await runValidation(
      { body: { email: 'test@example.com', password: 'password123' } },
      validateLoginInput
    )
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce quando email mancante', async () => {
    const result = await runValidation({ body: { password: 'password123' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })

  it('fallisce con formato email non valido', async () => {
    const result = await runValidation({ body: { email: 'not-an-email', password: 'password123' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })

  it('fallisce quando password mancante', async () => {
    const result = await runValidation({ body: { email: 'test@example.com' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('password'))).toBe(true)
  })

  it('fallisce quando password troppo corta', async () => {
    const result = await runValidation({ body: { email: 'test@example.com', password: '12' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('almeno 6'))).toBe(true)
  })

  it('passa con password esattamente 6 caratteri', async () => {
    const result = await runValidation(
      { body: { email: 'test@example.com', password: '123456' } },
      validateLoginInput
    )
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce quando email è stringa vuota', async () => {
    const result = await runValidation(
      { body: { email: '', password: 'password123' } },
      validateLoginInput
    )
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })

  it('fallisce quando password è stringa vuota', async () => {
    const result = await runValidation(
      { body: { email: 'test@example.com', password: '' } },
      validateLoginInput
    )
    expect(result.array().some(e => e.msg.includes('password'))).toBe(true)
  })

  it('normalizza email con maiuscole e punti', async () => {
    const result = await runValidation(
      { body: { email: 'TEST@GMAIL.COM', password: 'password123' } },
      validateLoginInput
    )
    expect(result.isEmpty()).toBe(true)
    expect(result.array().length).toBe(0)
  })

  it("fallisce con email 'test@' senza dominio", async () => {
    const result = await runValidation(
      { body: { email: 'test@', password: 'password123' } },
      validateLoginInput
    )
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })

  it("fallisce con email '@example.com' senza parte locale", async () => {
    const result = await runValidation(
      { body: { email: '@example.com', password: 'password123' } },
      validateLoginInput
    )
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })
})
