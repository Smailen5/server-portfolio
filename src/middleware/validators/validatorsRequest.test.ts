import { describe, expect, it, vi } from 'vitest'
import { validationResult } from 'express-validator'
import { validateRequest } from './validatorsRequest'

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// Sostituiamo solo validationResult, tenendo il resto
// di express-validator originale. In questo modo possiamo
// controllare cosa restituisce senza alterare altri comportamenti.
vi.mock('express-validator', async () => {
  const actual = await vi.importActual<typeof import('express-validator')>('express-validator')
  return {
    ...actual,
    validationResult: vi.fn(),
  }
})

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = {} as any
  const res = {} as any
  const next = vi.fn()
  return { req, res, next }
}

// ──────────────────────────────────────────────
// Test per validateRequest
// ──────────────────────────────────────────────
// validateRequest è un middleware che controlla se ci sono
// errori di validazione (da express-validator):
// - se non ci sono errori → chiama next()
// - se ci sono errori → lancia AppError con i messaggi concatenati

describe('validateRequest', () => {
  it('chiama next() quando non ci sono errori', () => {
    // validationResult.isEmpty() = true → nessun errore
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
      array: vi.fn(),
    } as any)

    const { req, res, next } = mockReqRes()
    validateRequest(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('lancia AppError con messaggi concatenati quando ci sono errori', () => {
    // validationResult.isEmpty() = false → ci sono errori
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: 'Campo obbligatorio' },
        { msg: 'Formato non valido' },
      ],
    } as any)

    const { req, res, next } = mockReqRes()

    // Il middleware lancia un'eccezione, la catturiamo per verificarla
    expect(() => validateRequest(req, res, next)).toThrow('Campo obbligatorio, Formato non valido')
    expect(next).not.toHaveBeenCalled()
  })
})
