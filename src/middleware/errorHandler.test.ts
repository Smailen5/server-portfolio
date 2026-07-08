import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../config/appLogger.js', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

vi.mock('../config/env.js', async () => {
  const actual = await vi.importActual<typeof import('../config/env.js')>('../config/env.js')
  return {
    ...actual,
    env: { ...actual.env, isDevelopment: false },
  }
})

import { AppError, errorHandler, notFoundHandler } from './errorHandler.js'
import { appLogger } from '../config/appLogger.js'
import { env } from '../config/env.js'

function mockReqRes(overrides?: { originalUrl?: string }) {
  const req = { originalUrl: overrides?.originalUrl ?? '/test-path' } as any
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  const next = vi.fn()
  return { req, res, next }
}

describe('AppError', () => {
  it('statusCode 4xx imposta status "fail"', () => {
    const err = new AppError('Not found', 404)
    expect(err).toMatchObject({
      message: 'Not found',
      statusCode: 404,
      status: 'fail',
      isOperational: true,
    })
  })

  it('statusCode 5xx imposta status "error"', () => {
    const err = new AppError('Server error', 500)
    expect(err).toMatchObject({
      message: 'Server error',
      statusCode: 500,
      status: 'error',
      isOperational: true,
    })
  })
})

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('AppError in produzione → { status, message }, niente stack', () => {
    vi.mocked(env).isDevelopment = false
    const { req, res, next } = mockReqRes()
    const err = new AppError('Dati non validi', 422)

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Dati non validi',
    })
  })

  it('AppError in development → { status, message, stack }', () => {
    vi.mocked(env).isDevelopment = true
    const { req, res, next } = mockReqRes()
    const err = new AppError('Dati non validi', 422)

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'fail',
        message: 'Dati non validi',
        stack: expect.any(String),
      })
    )
  })

  it('Errore generico in produzione → 500 con messaggio generico', () => {
    vi.mocked(env).isDevelopment = false
    const { req, res, next } = mockReqRes()
    const err = new Error('DB connection failed')

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Qualcosa è andato storto!',
    })
  })

  it('Errore generico in development → 500 con messaggio originale + stack', () => {
    vi.mocked(env).isDevelopment = true
    const { req, res, next } = mockReqRes()
    const err = new Error('DB connection failed')

    errorHandler(err, req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'DB connection failed',
        stack: expect.any(String),
      })
    )
  })
})

describe('notFoundHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('risponde 404 con status "fail" e originalUrl nel messaggio', () => {
    const { req, res } = mockReqRes({ originalUrl: '/api/inesistente' })

    notFoundHandler(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Non è possibile trovare /api/inesistente su questo server',
    })
  })

  it('logga un warn con appLogger', () => {
    const { req, res } = mockReqRes({ originalUrl: '/api/inesistente' })

    notFoundHandler(req, res)

    expect(appLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('404')
    )
    expect(appLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('/api/inesistente')
    )
  })
})
