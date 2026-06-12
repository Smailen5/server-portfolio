import { describe, expect, it, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { jwtAuth } from './jwtAuth'

vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn() },
}))

function mockReqRes() {
  const req = { headers: {} } as any
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  const next = vi.fn()
  return { req, res, next }
}

describe('jwtAuth', () => {
  it('responds 401 when token is missing', () => {
    const { req, res, next } = mockReqRes()

    jwtAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Accesso non autorizzato, token mancante' })
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 401 when token is invalid', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer invalid-token'
    vi.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('jwt malformed') })

    jwtAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Token non valido' })
    expect(next).not.toHaveBeenCalled()
  })

  it('sets req.user and calls next() with a valid token', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer valid-token'
    const decoded = { id: 'user123', iat: 123 }
    vi.spyOn(jwt, 'verify').mockReturnValue(decoded as any)

    jwtAuth(req, res, next)

    expect(req.user).toEqual(decoded)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('responds 401 when token is expired', () => {
    const { req, res, next } = mockReqRes()
    req.headers.authorization = 'Bearer expired-token'
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
