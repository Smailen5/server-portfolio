import { describe, expect, it, vi } from 'vitest'

const validBody = {
  name: 'New Project',
  link: 'https://example.com',
  image: 'https://example.com/img.png',
  technologies: ['React'],
  description: 'New desc',
  readme: '# Readme',
}

vi.mock('../../models/Projects', () => ({
  Project: { create: vi.fn() },
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

describe('createProject', () => {
  it('crea e restituisce il progetto', async () => {
    const created = { _id: 'new', ...validBody }
    vi.mocked(Project.create).mockResolvedValue(created as any)
    const mod = await import('./createProject')
    const handler = getHandler(mod.createProject)
    const { req, res, next } = mockReqRes()
    req.body = validBody
    await handler(req, res, next)
    expect(Project.create).toHaveBeenCalledWith(validBody)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(created)
  })

  it('risponde 500 in caso di errore', async () => {
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
