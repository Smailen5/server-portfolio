import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano un documento Mongoose trovato
// ──────────────────────────────────────────────
// deleteOne è un metodo dell'ISTANZA del documento,
// non una funzione statica del modello Project.
// Per questo mocko deleteOne DENTRO l'oggetto restituito da findOne.
const existingProject = {
  _id: '1',
  name: 'To Delete',
  deleteOne: vi.fn().mockResolvedValue(undefined),
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

// Nota: non mocko Project.deleteOne, perché il controller
// chiama project.deleteOne() sull'istanza, non sul modello.
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

// deleteProject è un array: [idValidator, validateRequest,
// authMiddleware, jwtAuth, handler]. getHandler estrae il vero handler.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per deleteProject
// ──────────────────────────────────────────────

describe('deleteProject', () => {
  it('elimina e conferma la rimozione', async () => {
    // findOne restituisce un progetto esistente che ha deleteOne mockato
    vi.mocked(Project.findOne).mockResolvedValue(existingProject as any)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res, next } = mockReqRes()
    req.params.id = '1'
    await handler(req, res, next)

    // Verifico la ricerca E la chiamata a deleteOne sull'istanza
    expect(Project.findOne).toHaveBeenCalledWith({ _id: '1' })
    expect(existingProject.deleteOne).toHaveBeenCalledWith({ _id: '1' })
    expect(res.json).toHaveBeenCalledWith({ message: 'Project eliminato' })
  })

  it('risponde 404 quando il progetto non esiste', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(null)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res, next } = mockReqRes()
    req.params.id = 'nonexistent'
    await handler(req, res, next)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Project non trovato' })
  })
})
