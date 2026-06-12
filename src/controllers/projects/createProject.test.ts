import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano il corpo della richiesta POST
// ──────────────────────────────────────────────
const validBody = {
  name: 'New Project',
  link: 'https://example.com',
  image: 'https://example.com/img.png',
  technologies: ['React'],
  description: 'New desc',
  readme: '# Readme',
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
vi.mock('../../models/Projects', () => ({
  Project: { create: vi.fn() },
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

// createProject è un array: [createProjectValidator, validateRequest,
// authMiddleware, jwtAuth, handler]. getHandler estrae il vero handler.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per createProject
// ──────────────────────────────────────────────

describe('createProject', () => {
  it('crea e restituisce il progetto', async () => {
    // Simulo MongoDB che restituisce il progetto con _id assegnato
    const created = { _id: 'new', ...validBody }
    vi.mocked(Project.create).mockResolvedValue(created as any)
    const mod = await import('./createProject')
    const handler = getHandler(mod.createProject)
    const { req, res, next } = mockReqRes()
    // Passo il body direttamente (i middleware di validazione sono saltati)
    req.body = validBody
    await handler(req, res, next)

    // Verifico che create sia stato chiamato con i dati esatti
    expect(Project.create).toHaveBeenCalledWith(validBody)
    // 201 = Created, più preciso di 200 per le creazioni
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(created)
  })

  it('risponde 500 in caso di errore', async () => {
    // mockRejectedValue simula un errore MongoDB
    vi.mocked(Project.create).mockRejectedValue(new Error('Validation failed'))
    const mod = await import('./createProject')
    const handler = getHandler(mod.createProject)
    const { req, res, next } = mockReqRes()
    req.body = validBody
    await handler(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed' })
  })
})
