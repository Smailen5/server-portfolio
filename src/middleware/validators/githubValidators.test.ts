import { describe, expect, it } from 'vitest'
import { syncValidator } from './githubValidators'
import { runValidation } from './testHelpers'

// ──────────────────────────────────────────────
// Test per syncValidator
// ──────────────────────────────────────────────
// Valida l'header x-api-key: 16-64 caratteri alfanumerici misti.
describe('syncValidator', () => {
  it('passa con header API key valido', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'AbcDefGhiJk1MnoPqrSt' } },
      syncValidator
    )
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce quando x-api-key mancante', async () => {
    const result = await runValidation({ headers: {} }, syncValidator)
    expect(result.array().some(e => e.msg.includes('chiave'))).toBe(true)
  })

  it('fallisce quando chiave troppo corta', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'short' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('Chiave API non valida'))).toBe(true)
  })

  it('fallisce quando chiave senza maiuscole', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'abcdefghijklmnopqrst' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('Chiave API non valida'))).toBe(true)
  })

  it('fallisce quando chiave senza minuscole', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'ABCDEFGHIJKLMNOPQRST' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('Chiave API non valida'))).toBe(true)
  })

  it('fallisce quando chiave senza numeri', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'Abcdefghijklmnopqrst' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('Chiave API non valida'))).toBe(true)
  })

  it('fallisce quando chiave supera 20 caratteri', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'A1bC2dE3fG4hI5jK6lM7n' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('Chiave API non valida'))).toBe(true)
  })

  it('fallisce quando chiave contiene caratteri speciali', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'AbcDefGhi!JklMnoPqrS' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('Chiave API non valida'))).toBe(true)
  })

  it('fallisce quando chiave è stringa vuota', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': '' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('chiave'))).toBe(true)
  })

  it('fallisce quando chiave è un numero', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 123 } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('stringa'))).toBe(true)
  })
})
