import { describe, expect, it, vi } from 'vitest'

const mockProjects = [
  { _id: '1', name: 'Project A', description: 'First', technologies: ['React'] },
  { _id: '2', name: 'Project B', description: 'Second', technologies: ['Vue'] },
]

vi.mock('../../models/Projects', () => ({
  Project: { find: vi.fn() },
}))

import { Project } from '../../models/Projects'

function mockReqRes() {
  const req = { params: {}, body: {} } as any
  const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as any
  const next = vi.fn()
  return { req, res, next }
}

describe('getAllProjects', () => {
  it('restituisce tutti i progetti ordinati per createdAt desc', async () => {
    vi.mocked(Project.find).mockReturnValue({ sort: vi.fn().mockResolvedValue(mockProjects) } as any)
    const { req, res, next } = mockReqRes()
    const { getAllProjects } = await import('./getAllProjects')
    await getAllProjects(req, res, next)
    expect(Project.find).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(mockProjects)
  })

  it('risponde 500 in caso di errore', async () => {
    vi.mocked(Project.find).mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('DB fail')) } as any)
    const { req, res, next } = mockReqRes()
    const { getAllProjects } = await import('./getAllProjects')
    await getAllProjects(req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'DB fail' })
  })
})
