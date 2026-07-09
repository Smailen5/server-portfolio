import { beforeEach, describe, expect, it, vi } from 'vitest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { logUser } from './authController'

// ──────────────────────────────────────────────
// Dati finti: simulano un utente MongoDB
// ──────────────────────────────────────────────
const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'admin@test.com',
  password: '$2b$10$hashedpassword',
  // updateOne è un metodo dell'istanza, non del modello
  updateOne: vi.fn().mockResolvedValue(undefined),
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// Sostituiamo User.findOne per evitare di chiamare MongoDB
// Il mock supporta il chaining .select('+password')
const { mockSelect } = vi.hoisted(() => ({
  mockSelect: vi.fn(),
}))
vi.mock('../../models/User', () => ({
  User: {
    findOne: vi.fn().mockReturnValue({
      select: mockSelect,
    }),
  },
}))

// Sostituiamo appLogger per evitare output nei log
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

// Mock di env per controllare jwtSecret nei test
vi.mock('../../config/env', () => ({
  env: { jwtSecret: 'test-secret' },
}))

import { User } from '../../models/User'

// ──────────────────────────────────────────────
// Helper: crea req e res finti per Express
// ──────────────────────────────────────────────
function mockReqRes(overrides = {}) {
  const req = {
    body: { email: 'admin@test.com', password: 'password123' },
    ...overrides,
  } as any
  const res = {
    // mockReturnThis() permette il chaining res.status(401).json(...)
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  return { req, res }
}

// ──────────────────────────────────────────────
// Test per logUser (authController)
// ──────────────────────────────────────────────
// logUser gestisce il login: cerca l'utente per email,
// verifica la password con bcrypt, e se tutto ok genera
// un token JWT con scadenza 24h.

describe('logUser', () => {
  // Ogni test parte con mock puliti
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('risponde 401 quando l\'utente non esiste', async () => {
    // User.findOne().select() restituisce null → utente non trovato
    mockSelect.mockResolvedValue(null)
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Credenziali non valide' })
  })

  it('risponde 401 quando la password è errata', async () => {
    mockSelect.mockResolvedValue(mockUser as any)
    // bcrypt.compare restituisce false → password sbagliata
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Credenziali non valide' })
  })

  it('restituisce un token JWT al login riuscito', async () => {
    mockSelect.mockResolvedValue(mockUser as any)
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
    vi.spyOn(jwt, 'sign').mockReturnValue('mock-token' as any)
    const { req, res } = mockReqRes()

    await logUser(req, res)

    // Verifico che abbia aggiornato lastLogin
    expect(mockUser.updateOne).toHaveBeenCalledWith({ lastLogin: expect.any(Date) })
    // Verifico che abbia firmato il token con i dati giusti
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      'test-secret',
      { expiresIn: '24h' }
    )
    expect(res.json).toHaveBeenCalledWith({ token: 'mock-token' })
  })

  it('risponde 500 in caso di errore imprevisto', async () => {
    // mockRejectedValue simula un'eccezione (es. DB down)
    mockSelect.mockRejectedValue(new Error('DB error'))
    const { req, res } = mockReqRes()

    await logUser(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Errore durante il login' })
  })
})
