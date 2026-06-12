import { beforeEach, describe, expect, it, vi } from 'vitest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { logUser } from './authController'

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'admin@test.com',
  password: '$2b$10$hashedpassword',
  updateOne: vi.fn().mockResolvedValue(undefined),
}

vi.mock('../../models/User', () => ({
  User: { findOne: vi.fn() },
}))

vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

import { User } from '../../models/User'

function mockReqRes(overrides = {}) {
  const req = {
    body: { email: 'admin@test.com', password: 'password123' },
    ...overrides,
  } as any
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  return { req, res }
}

describe('logUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret'
  })

  it('responds 401 when user is not found', async () => {
    vi.mocked(User.findOne).mockResolvedValue(null)
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Credenziali non valide' })
  })

  it('responds 401 when password is wrong', async () => {
    vi.mocked(User.findOne).mockResolvedValue(mockUser as any)
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Credenziali non valide' })
  })

  it('responds with token on successful login', async () => {
    vi.mocked(User.findOne).mockResolvedValue(mockUser as any)
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
    vi.spyOn(jwt, 'sign').mockReturnValue('mock-token' as any)
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(mockUser.updateOne).toHaveBeenCalled()
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      'test-secret',
      { expiresIn: '24h' }
    )
    expect(res.json).toHaveBeenCalledWith({ token: 'mock-token' })
  })

  it('responds 500 on unexpected error', async () => {
    vi.mocked(User.findOne).mockRejectedValue(new Error('DB error'))
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Errore durante il login' })
  })
})
