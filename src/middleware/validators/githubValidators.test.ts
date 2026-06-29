import { describe, expect, it } from 'vitest'
import { validationResult } from 'express-validator'
import { syncValidator } from './githubValidators'

async function runValidation(req: Record<string, unknown>, validations: typeof syncValidator) {
  for (const v of validations) {
    await v.run(req)
  }
  return validationResult(req)
}

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
    expect(result.array().some(e => e.msg.includes('caratteri'))).toBe(true)
  })

  it('fallisce quando chiave senza maiuscole', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'abcdefghijklmnopqrst' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('maiuscole'))).toBe(true)
  })

  it('fallisce quando chiave senza minuscole', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'ABCDEFGHIJKLMNOPQRST' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('minuscole'))).toBe(true)
  })

  it('fallisce quando chiave senza numeri', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'Abcdefghijklmnopqrst' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('numeri'))).toBe(true)
  })
})
