import { beforeEach, describe, expect, it, vi } from 'vitest'
import { validationResult } from 'express-validator'
import { handleLoginValidation } from './validatorsLogin'
import { appLogger } from '../../config/appLogger.js'

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
vi.mock('../../config/appLogger.js', () => ({
  appLogger: {
    warn: vi.fn(),
  },
}))

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
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  const next = vi.fn()
  return { req, res, next }
}

// ──────────────────────────────────────────────
// Test per handleLoginValidation
// ──────────────────────────────────────────────
// handleLoginValidation è un middleware che controlla se ci sono
// errori di validazione (da express-validator):
// - se ci sono errori → risponde con 400 e { success: false, errors: [...] }
// - se non ci sono errori → chiama next()

describe('handleLoginValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('restituisce 400 con success: false quando ci sono errori', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [{ msg: 'Campo obbligatorio' }],
    } as any)

    const { req, res, next } = mockReqRes()
    handleLoginValidation(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    )
    expect(next).not.toHaveBeenCalled()
    expect(appLogger.warn).toHaveBeenCalledTimes(1)
    expect(appLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Campo obbligatorio')
    )
  })

  it("restituisce l'array di messaggi corretto quando ci sono errori", () => {
    const errori = [{ msg: 'Campo A' }, { msg: 'Campo B' }]
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => errori,
    } as any)

    const { req, res, next } = mockReqRes()
    handleLoginValidation(req, res, next)

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      errors: errori,
    })
    expect(appLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Campo A; Campo B')
    )
  })

  it('chiama next() quando non ci sono errori', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
      array: vi.fn(),
    } as any)

    const { req, res, next } = mockReqRes()
    handleLoginValidation(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(appLogger.warn).not.toHaveBeenCalled()
  })
})
