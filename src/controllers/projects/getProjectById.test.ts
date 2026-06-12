import { describe, expect, it, vi } from 'vitest'

const mockProject = { _id: '1', name: 'Project A', description: 'First', technologies: ['React'] }

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

describe('getProjectById', () => {
  it('restituisce il progetto quando trovato', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(mockProject as any)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res, next } = mockReqRes()
    req.params.id = '1'
    await handler(req, res, next)
    expect(Project.findOne).toHaveBeenCalledWith({ _id: '1' })
    expect(res.json).toHaveBeenCalledWith(mockProject)
  })

  it('risponde 404 quando il progetto non esiste', async () => {
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
