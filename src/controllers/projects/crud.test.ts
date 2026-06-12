import { describe, expect, it, vi } from 'vitest'
import { getAllProjects } from './getAllProjects'

const mockProjects = [
  { _id: '1', name: 'Project A', description: 'First', technologies: ['React'], toJSON: () => ({}) },
  { _id: '2', name: 'Project B', description: 'Second', technologies: ['Vue'], toJSON: () => ({}) },
]

function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

function mockReqRes() {
  const req = { params: {}, body: {} } as any
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  return { req, res }
}

vi.mock('../../models/Projects', () => ({
  Project: {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findOneAndUpdate: vi.fn(),
    deleteOne: vi.fn(),
  },
}))

import { Project } from '../../models/Projects'

describe('getAllProjects', () => {
  it('returns all projects sorted by createdAt desc', async () => {
    vi.mocked(Project.find).mockReturnValue({ sort: vi.fn().mockResolvedValue(mockProjects) } as any)
    const { req, res } = mockReqRes()

    await getAllProjects(req, res)

    expect(Project.find).toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(mockProjects)
  })

  it('responds 500 on error', async () => {
    vi.mocked(Project.find).mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('DB fail')) } as any)
    const { req, res } = mockReqRes()

    await getAllProjects(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'DB fail' })
  })
})

describe('getProjectById', () => {
  it('returns a project when found', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(mockProjects[0] as any)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res } = mockReqRes()
    req.params.id = '1'

    await handler(req, res)

    expect(Project.findOne).toHaveBeenCalledWith({ _id: '1' })
    expect(res.json).toHaveBeenCalledWith(mockProjects[0])
  })

  it('responds 404 when project not found', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(null)
    const mod = await import('./getProjectById')
    const handler = getHandler(mod.getProjectById)
    const { req, res } = mockReqRes()
    req.params.id = 'nonexistent'

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Progetto non trovato' })
  })
})

describe('createProject', () => {
  const validBody = {
    name: 'New Project',
    link: 'https://example.com',
    image: 'https://example.com/img.png',
    technologies: ['React'],
    description: 'New desc',
    readme: '# Readme',
  }

  it('creates and returns a project', async () => {
    const created = { _id: 'new', ...validBody }
    vi.mocked(Project.create).mockResolvedValue(created as any)
    const mod = await import('./createProject')
    const handler = getHandler(mod.createProject)
    const { req, res } = mockReqRes()
    req.body = validBody

    await handler(req, res)

    expect(Project.create).toHaveBeenCalledWith(validBody)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(created)
  })

  it('responds 500 on error', async () => {
    vi.mocked(Project.create).mockRejectedValue(new Error('Validation failed'))
    const mod = await import('./createProject')
    const handler = getHandler(mod.createProject)
    const { req, res } = mockReqRes()
    req.body = validBody

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed' })
  })
})

describe('updateProject', () => {
  const updateBody = { name: 'Updated', image: 'https://example.com/new.png', technologies: ['Node'], description: 'Updated desc' }

  it('updates and returns the project', async () => {
    const updated = { _id: '1', ...updateBody }
    vi.mocked(Project.findOneAndUpdate).mockResolvedValue(updated as any)
    const mod = await import('./updateProject')
    const handler = getHandler(mod.updateProject)
    const { req, res } = mockReqRes()
    req.params.id = '1'
    req.body = updateBody

    await handler(req, res)

    expect(Project.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '1' },
      updateBody,
      { new: true }
    )
    expect(res.json).toHaveBeenCalledWith(updated)
  })

  it('responds 404 when project not found', async () => {
    vi.mocked(Project.findOneAndUpdate).mockResolvedValue(null)
    const mod = await import('./updateProject')
    const handler = getHandler(mod.updateProject)
    const { req, res } = mockReqRes()
    req.params.id = 'nonexistent'
    req.body = updateBody

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Project non trovato' })
  })
})

describe('deleteProject', () => {
  const existingProject = { _id: '1', name: 'To Delete', deleteOne: vi.fn().mockResolvedValue(undefined) }

  it('deletes and confirms removal', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(existingProject as any)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res } = mockReqRes()
    req.params.id = '1'

    await handler(req, res)

    expect(Project.findOne).toHaveBeenCalledWith({ _id: '1' })
    expect(existingProject.deleteOne).toHaveBeenCalledWith({ _id: '1' })
    expect(res.json).toHaveBeenCalledWith({ message: 'Project eliminato' })
  })

  it('responds 404 when project not found', async () => {
    vi.mocked(Project.findOne).mockResolvedValue(null)
    const mod = await import('./deleteProject')
    const handler = getHandler(mod.deleteProject)
    const { req, res } = mockReqRes()
    req.params.id = 'nonexistent'

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ message: 'Project non trovato' })
  })
})
