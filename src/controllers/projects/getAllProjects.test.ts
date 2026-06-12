import { describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano documenti MongoDB
// ──────────────────────────────────────────────
const mockProjects = [
  { _id: '1', name: 'Project A', description: 'First', technologies: ['React'] },
  { _id: '2', name: 'Project B', description: 'Second', technologies: ['Vue'] },
]

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// getAllProjects usa solo Project.find(), quindi
// mocko solo quel metodo. Meno mock = test più leggibile.
vi.mock('../../models/Projects', () => ({
  Project: { find: vi.fn() },
}))

// Importo il modello DOPO vi.mock() (vitest lo sposta in alto)
import { Project } from '../../models/Projects'

// ──────────────────────────────────────────────
// Helper: crea req, res, next finti come Express
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { params: {}, body: {} } as any
  // mockReturnThis() permette il chaining: res.status(500).json(...)
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as any
  // next è il terzo parametro richiesto da RequestHandler
  const next = vi.fn()
  return { req, res, next }
}

// ──────────────────────────────────────────────
// Test per getAllProjects
// ──────────────────────────────────────────────
// getAllProjects è un controller semplice:
// chiama Project.find().sort() e restituisce i risultati.
// NON ha middleware, NON ha parametri dalla richiesta.

describe('getAllProjects', () => {
  it('restituisce tutti i progetti ordinati per createdAt desc', async () => {
    // Project.find() in Mongoose restituisce un oggetto query,
    // non direttamente i dati. Per questo mocko anche .sort().
    vi.mocked(Project.find).mockReturnValue({ sort: vi.fn().mockResolvedValue(mockProjects) } as any)
    const { req, res, next } = mockReqRes()

    // Import dinamico: i mock devono essere già attivi quando
    // il modulo viene caricato.
    const { getAllProjects } = await import('./getAllProjects')
    await getAllProjects(req, res, next)

    expect(Project.find).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(mockProjects)
  })

  it('risponde 500 in caso di errore', async () => {
    // mockRejectedValue simula un'eccezione (es. DB down)
    vi.mocked(Project.find).mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('DB fail')) } as any)
    const { req, res, next } = mockReqRes()

    const { getAllProjects } = await import('./getAllProjects')
    await getAllProjects(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'DB fail' })
  })
})
