import { describe, expect, it, vi } from 'vitest'

const existingProject = {
  _id: '1',
  name: 'To Delete',
  deleteOne: vi.fn().mockResolvedValue(undefined),
}

vi.mock('../../models/Projects', () => ({
  Project: { findOne: vi.fn() },
}))

import { Project } from '../../models/Projects'

function mockReqRes() {
  const req = { params: {}, body: {} } as any
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as any
  const next = vi.fn()
  return { req, res, next }
}

function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

describe('deleteProject', () => {
  it('elimina e conferma la rimozione', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(existingProject as any)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res, next } = mockReqRes()
    req.params.id = '1'
    await handler(req, res, next)
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
