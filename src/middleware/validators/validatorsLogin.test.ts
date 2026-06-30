import { describe, expect, it, vi } from 'vitest'
import { validationResult } from 'express-validator'
import { handleLoginValidation } from './validatorsLogin'

vi.mock('express-validator', async () => {
  const actual = await vi.importActual<typeof import('express-validator')>('express-validator')
  return {
    ...actual,
    validationResult: vi.fn(),
  }
})

function mockReqRes() {
  const req = {} as any
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  const next = vi.fn()
  return { req, res, next }
}

describe('handleLoginValidation', () => {
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
  })

  it('chiama next() quando non ci sono errori', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
      array: vi.fn(),
    } as any)

    const { req, res, next } = mockReqRes()
    handleLoginValidation(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })
})
