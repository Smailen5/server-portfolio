import { beforeEach, describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti: simulano cosa restituirebbe GitHub
// ──────────────────────────────────────────────

// getProjectsFromGithub restituirà queste 2 cartelle
const mockPackages = [
  { name: 'react-app', path: 'packages/react-app', type: 'dir', html_url: 'https://github.com/repo/react-app' },
  { name: 'vue-app', path: 'packages/vue-app', type: 'dir', html_url: 'https://github.com/repo/vue-app' },
]

// getPackageJson restituirà questi dati per ogni cartella
const mockPackageJson = {
  name: 'React App',
  description: 'A React project',
  technologies: ['react', 'vite'],
  createdAt: '2024-01-01',
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// Sostituiamo i moduli reali con versioni finte.
// vitest sposta in alto (hoisting) questi vi.mock() prima di
// qualsiasi import, quindi quando il controller verrà
// caricato, troverà già i mock al posto dei moduli veri.

vi.mock('../../config', () => ({
  // Diamo un githubToken finto anziché leggere dal .env
  env: { githubToken: 'mock-token' },
}))

const mockGitHubService = {
  getRepositories: vi.fn(),
  getPackageJson: vi.fn(),
  getScreenshot: vi.fn(),
  getReadme: vi.fn(),
}

vi.mock('../../services/GitHubService', () => ({
  createGitHubService: vi.fn(() => mockGitHubService),
}))

const mockCache = {
  get: vi.fn(),
  set: vi.fn(),
  invalidate: vi.fn(),
  clear: vi.fn(),
}

vi.mock('../../utils/cache', () => ({
  cache: mockCache,
}))

import { createGitHubService } from '../../services/GitHubService'

// ──────────────────────────────────────────────
// Helper: crea req e res finti come quelli di Express
// ──────────────────────────────────────────────
function mockReqRes() {
  const req = { headers: {}, body: {} } as any
  const res = {
    // mockReturnThis() fa sì che res.status() restituisca res,
    // così funziona il chaining: res.status(500).json(...)
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  // next è il terzo parametro che Express passa ai middleware/handler
  const next = vi.fn()
  return { req, res, next }
}

// ──────────────────────────────────────────────
// Test per getRepos
// ──────────────────────────────────────────────
// getRepos è un controller semplice: prende i progetti
// da GitHub, per ognuno legge il package.json, e restituisce
// i dati formattati. NON tocca il database.

describe('getRepos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCache.get.mockReturnValue(null)
  })

  // Test 1: percorso felice — GitHub risponde, tutto ok
  it('restituisce le info dei package per ogni cartella', async () => {
    // Predispongo i mock: dico loro cosa restituire
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson)

    // Importo il controller DOPO aver configurato i mock.
    // L'import dinamico (await import) è fondamentale:
    // se importassi in cima al file, i mock non sarebbero
    // ancora pronti al momento dell'import.
    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    // Eseguo il controller come farebbe Express
    await getRepos(req, res, next)

    // Verifico che abbia creato il service chiamando la factory
    expect(createGitHubService).toHaveBeenCalled()
    // Verifico che abbia chiamato le funzioni del service
    expect(mockGitHubService.getRepositories).toHaveBeenCalled()
    expect(mockGitHubService.getPackageJson).toHaveBeenCalledTimes(2)

    // Verifico che abbia risposto con i dati giusti
    expect(res.json).toHaveBeenCalledWith([
      {
        name: 'React App',
        description: 'A React project',
        url: 'https://github.com/repo/react-app',
        technologies: ['react', 'vite'],
        updated_at: '2024-01-01',
      },
      {
        name: 'React App',
        description: 'A React project',
        url: 'https://github.com/repo/vue-app',
        technologies: ['react', 'vite'],
        updated_at: '2024-01-01',
      },
    ])
  })

  // Test 2: package.json mancante — deve usare il nome cartella come fallback
  it('usa il nome cartella come fallback quando package.json manca', async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    // getPackageJson restituisce null → simula cartella senza package.json
    mockGitHubService.getPackageJson.mockResolvedValue(null)

    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    await getRepos(req, res, next)

    // Prendo il primo argomento della prima chiamata a res.json
    const data = (res.json.mock.calls[0] as any[])[0]
    // Il nome deve essere 'react-app' (nome cartella), non 'React App' (package.json)
    expect(data[0].name).toBe('react-app')
    expect(data[0].description).toBe('')
  })

  // Test 3: GitHub API non risponde — deve restituire 500
  it('risponde 500 quando GitHub API fallisce', async () => {
    // mockRejectedValue simula un'eccezione (Promise rifiutata)
    mockGitHubService.getRepositories.mockRejectedValue(new Error('API rate limit'))

    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    await getRepos(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'API rate limit' })
  })

  // Test 4: cache hit — restituisce dati cached senza chiamare GitHub API
  it('restituisce dati cached senza chiamare GitHub API', async () => {
    const cachedData = [{ name: 'Cached Project', description: 'From cache', url: 'https://cached', technologies: [], updated_at: '2024-01-01' }]
    mockCache.get.mockReturnValue(cachedData)

    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    await getRepos(req, res, next)

    expect(mockCache.get).toHaveBeenCalledWith('github:repos')
    expect(mockGitHubService.getRepositories).not.toHaveBeenCalled()
    expect(res.json).toHaveBeenCalledWith(cachedData)
  })

  // Test 5: cache miss — chiama GitHub API e salva in cache
  it('chiama GitHub API e salva in cache quando cache è vuota', async () => {
    mockCache.get.mockReturnValue(null)
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson)

    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    await getRepos(req, res, next)

    expect(mockCache.get).toHaveBeenCalledWith('github:repos')
    expect(mockGitHubService.getRepositories).toHaveBeenCalled()
    expect(mockCache.set).toHaveBeenCalledWith('github:repos', expect.any(Array), 5 * 60 * 1000)
  })
})
