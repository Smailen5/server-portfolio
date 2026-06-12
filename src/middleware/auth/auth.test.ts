import { describe, expect, it, vi } from 'vitest'
import { authMiddleware } from './auth'

vi.mock('../../config/env', () => ({
  env: { apiKey: 'valid-api-key' },
}))

function mockReqRes() {
  const req = { headers: {} } as any
  const res = {} as any
  const next = vi.fn()
  return { req, res, next }
}

describe('authMiddleware', () => {
  it('throws AppError when API key is missing', () => {
    const { req, res, next } = mockReqRes()

    try {
      authMiddleware(req, res, next)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.message).toBe('API Key mancante')
      expect(err.statusCode).toBe(401)
    }
    expect(next).not.toHaveBeenCalled()
  })

  it('throws AppError when API key is wrong', () => {
    const { req, res, next } = mockReqRes()
    req.headers['x-api-key'] = 'wrong-key'

    try {
      authMiddleware(req, res, next)
      expect.fail('Should have thrown')
    } catch (err: any) {
      expect(err.message).toBe('API Key non valida')
      expect(err.statusCode).toBe(401)
    }
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next() when API key is valid', () => {
    const { req, res, next } = mockReqRes()
    req.headers['x-api-key'] = 'valid-api-key'

    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
