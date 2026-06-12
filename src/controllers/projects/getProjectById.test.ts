import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti
// ──────────────────────────────────────────────
const mockProject = { _id: '1', name: 'Project A', description: 'First', technologies: ['React'] }

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// appLogger va mockato per primo: i controller importano
// validateRequest → errorHandler → appLogger, che in CI
// crasha perché i file path per i log non sono configurati.
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

vi.mock('../../models/Projects', () => ({
  Project: { findOne: vi.fn() },
}))

import { Project } from '../../models/Projects'

// ──────────────────────────────────────────────
// Helper
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { params: {}, body: {} } as any
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as any
  const next = vi.fn()
  return { req, res, next }
}

// getProjectById è un array: [idValidator, validateRequest, handler].
// getHandler estrae l'ultimo elemento (il vero handler) saltando i middleware.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per getProjectById
// ──────────────────────────────────────────────

describe('getProjectById', () => {
  it('restituisce il progetto quando trovato', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(mockProject as any)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res, next } = mockReqRes()
    // Il controller legge req.params.id per cercare il progetto.
    // Nel flusso reale, idValidator lo convaliderebbe prima.
    req.params.id = '1'
    await handler(req, res, next)

    // Verifico che abbia cercato con l'id giusto
    expect(Project.findOne).toHaveBeenCalledWith({ _id: '1' })
    expect(res.json).toHaveBeenCalledWith(mockProject)
  })

  it('risponde 404 quando il progetto non esiste', async () => {
    // findOne restituisce null → progetto inesistente
    vi.mocked(Project.findOne).mockResolvedValue(null)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res, next } = mockReqRes()
    req.params.id = 'nonexistent'
    await handler(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Progetto non trovato' })
  })
})
