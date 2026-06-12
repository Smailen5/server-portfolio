import { describe, expect, it, vi } from 'vitest'
import { validationResult } from 'express-validator'
import { validateRequest } from './validatorsRequest'

vi.mock('express-validator', async () => {
  const actual = await vi.importActual<typeof import('express-validator')>('express-validator')
  return {
    ...actual,
    validationResult: vi.fn(),
  }
})

function mockReqRes() {
  const req = {} as any
  const res = {} as any
  const next = vi.fn()
  return { req, res, next }
}

describe('validateRequest', () => {
  it('calls next() when there are no validation errors', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
      array: vi.fn(),
    } as any)

    const { req, res, next } = mockReqRes()
    validateRequest(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
  })

  it('throws AppError with joined messages when there are errors', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => [
        { msg: 'Campo obbligatorio' },
        { msg: 'Formato non valido' },
      ],
    } as any)

    const { req, res, next } = mockReqRes()

    expect(() => validateRequest(req, res, next)).toThrow('Campo obbligatorio, Formato non valido')
    expect(next).not.toHaveBeenCalled()
  })
})
