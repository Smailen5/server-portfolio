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
