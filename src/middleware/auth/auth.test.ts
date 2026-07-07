import { describe, expect, it, vi } from 'vitest'
import { authMiddleware } from './auth'
import { AppError } from '../errorHandler'

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// Forniamo un apiKey finto invece di leggerlo dal .env
vi.mock('../../config/env', () => ({
  env: { apiKey: 'valid-api-key' },
}))

// ──────────────────────────────────────────────
// Helper: crea req, res, next finti per Express
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { headers: {} } as any
  const res = {} as any
  const next = vi.fn()
  return { req, res, next }
}

// ──────────────────────────────────────────────
// Test per authMiddleware
// ──────────────────────────────────────────────
// authMiddleware controlla l'header x-api-key:
// - se mancante → AppError 401
// - se errata → AppError 401
// - se valida → chiama next()

describe('authMiddleware', () => {
  it('lancia AppError quando API key mancante', () => {
    const { req, res, next } = mockReqRes()

    // Il middleware lancia un'eccezione (non usa res.status().json())
    // quindi la catturiamo con try/catch
    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    const error = next.mock.calls[0][0]
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('API Key mancante')
    expect(error.statusCode).toBe(401)
  })

  it('lancia AppError quando API key errata', () => {
    const { req, res, next } = mockReqRes()
    req.headers['x-api-key'] = 'wrong-key'

    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
    const error = next.mock.calls[0][0]
    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('API Key non valida')
    expect(error.statusCode).toBe(401)
  })

  it('chiama next() quando API key valida', () => {
    const { req, res, next } = mockReqRes()
    // Uso la stessa chiave definita nel mock di env
    req.headers['x-api-key'] = 'valid-api-key'

    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalledTimes(1)
  })
})
