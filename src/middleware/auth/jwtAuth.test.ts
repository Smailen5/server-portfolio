import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { jwtAuth } from './jwtAuth'

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// Sostituiamo appLogger per evitare output nei test
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn() },
}))

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { headers: {} } as any
  // mockReturnThis() permette il chaining: res.status(401).json(...)
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  const next = vi.fn()
  return { req, res, next }
}

// ──────────────────────────────────────────────
// Test per jwtAuth
// ──────────────────────────────────────────────
// jwtAuth controlla il token JWT nell'header Authorization:
// - se mancante → 401 "Accesso non autorizzato"
// - se invalido/scaduto → 401 "Token non valido"
// - se valido → setta req.user e chiama next()

describe('jwtAuth', () => {
  it('risponde 401 quando token mancante', () => {
    const { req, res, next } = mockReqRes()
    // Nessun header authorization → token non presente

    jwtAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Accesso non autorizzato, token mancante' })
    expect(next).not.toHaveBeenCalled()
  })

  it('risponde 401 quando token non valido', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer invalid-token'
    // jwt.verify lancia un'eccezione → token malformato
    vi.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('jwt malformed') })

    jwtAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token non valido' })
    expect(next).not.toHaveBeenCalled()
  })

  it('setta req.user e chiama next() con token valido', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer valid-token'
    const decoded = { id: 'user123', iat: 123 }
    // jwt.verify restituisce il payload decodificato
    vi.spyOn(jwt, 'verify').mockReturnValue(decoded as any)

    jwtAuth(req, res, next)

    // Il middleware deve salvare il decoded su req.user
    expect(req.user).toEqual(decoded)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('risponde 401 quando token scaduto', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer expired-token'
    // Simulo un TokenExpiredError come farebbe jwt.verify
    vi.spyOn(jwt, 'verify').mockImplementation(() => {
      const err: any = new Error('jwt expired')
      err.name = 'TokenExpiredError'
      throw err
    })

    jwtAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token non valido' })
    expect(next).not.toHaveBeenCalled()
  })
})
