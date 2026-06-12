import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano il corpo della richiesta PUT
// ──────────────────────────────────────────────
const updateBody = {
  name: 'Updated',
  image: 'https://example.com/new.png',
  technologies: ['Node'],
  description: 'Updated desc',
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

vi.mock('../../models/Projects', () => ({
  Project: { findOneAndUpdate: vi.fn() },
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

// updateProject è un array: [updateProjectValidator, validateRequest,
// authMiddleware, jwtAuth, handler]. getHandler estrae il vero handler.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per updateProject
// ──────────────────────────────────────────────

describe('updateProject', () => {
  it('aggiorna e restituisce il progetto', async () => {
    // Simulo MongoDB che trova e aggiorna il documento
    const updated = { _id: '1', ...updateBody }
    vi.mocked(Project.findOneAndUpdate).mockResolvedValue(updated as any)
    const mod = await import('./updateProject')
    const handler = getHandler(mod.updateProject)
    const { req, res, next } = mockReqRes()
    req.params.id = '1'
    req.body = updateBody
    await handler(req, res, next)

    // Verifico TUTTI gli argomenti: filtro, dati, e opzione { new: true }.
    // Quest'ultima è fondamentale: restituisce il documento AGGIORNATO.
    expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '1' },
      updateBody,
      { new: true }
    )
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  it('risponde 404 quando il progetto non esiste', async () => {
    // findOneAndUpdate restituisce null → progetto non trovato
    vi.mocked(Project.findOneAndUpdate).mockResolvedValue(null)
    const mod = await import('./updateProject')
    const handler = getHandler(mod.updateProject)
    const { req, res, next } = mockReqRes()
    req.params.id = 'nonexistent'
    req.body = updateBody
    await handler(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Project non trovato' })
  })
})
