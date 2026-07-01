import { beforeEach, describe, expect, it, vi } from 'vitest'

// ──────────────────────────────────────────────
// Dati finti
// ──────────────────────────────────────────────

const mockPackages = [
  { name: 'react-app', path: 'packages/react-app', type: 'dir', html_url: 'https://github.com/repo/react-app' },
  { name: 'vue-app', path: 'packages/vue-app', type: 'dir', html_url: 'https://github.com/repo/vue-app' },
]

const mockPackageJson = {
  name: 'React App',
  description: 'A React project',
  technologies: ['react', 'vite'],
  createdAt: '2024-01-01',
}

// ──────────────────────────────────────────────
// Mock delle dipendenze
// ──────────────────────────────────────────────
// syncRepos usa:
// - GitHubService: 4 metodi
// - ProjectService: upsert

// appLogger va mockato: syncRepos importa middleware che
// a loro volta importano errorHandler -> appLogger, che in
// CI crasha perché i file path dei log non sono configurati.
vi.mock('../../config/appLogger', () => ({
  appLogger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

vi.mock('../../config', () => ({
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

const mockProjectService = {
  upsert: vi.fn(),
}

vi.mock('../../services/ProjectService', () => ({
  createProjectService: vi.fn(() => mockProjectService),
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
// Helper
// ──────────────────────────────────────────────

function mockReqRes() {
  const req = { headers: {}, body: {} } as any
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as any
  const next = vi.fn()
  return { req, res, next }
}

// syncRepos è un array: [syncValidator, validateRequest, authMiddleware, jwtAuth, handler].
// L'ultimo elemento è sempre il vero handler. Questa funzione lo estrae.
// In questo modo testiamo SOLO la logica del controller, saltando i middleware.
function getHandler(controller: unknown[]): (...args: any[]) => any {
  return controller[controller.length - 1] as any
}

// ──────────────────────────────────────────────
// Test per syncRepos
// ──────────────────────────────────────────────
// syncRepos è più complesso di getRepos:
// 1. Prende i progetti da GitHub (getProjectsFromGithub)
// 2. Per ognuno: screenshot, readme, package.json
// 3. Usa projectService.upsert() per salvare ogni progetto
// 4. Restituisce un riepilogo di quanti sincronizzati

describe('syncRepos', () => {
  // Ogni test parte con i mock "puliti" — nessuna chiamata
  // precedente registrata. Evita che un test influenzi l'altro.
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Test 1: percorso felice — tutto funziona, upsert crea progetti nuovi
  it('sincronizza i progetti da GitHub al database', async () => {
    // Configuro TUTTI i mock per simulare uno scenario completo
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson)
    mockGitHubService.getScreenshot.mockResolvedValue('https://example.com/screenshot.webp')
    mockGitHubService.getReadme.mockResolvedValue('# Readme content')

    mockProjectService.upsert.mockResolvedValue({} as any)

    // Import dinamico dopo i mock
    const { syncRepos } = await import('./syncRepos')
    const handler = getHandler(syncRepos)
    const { req, res, next } = mockReqRes()

    await handler(req, res, next)

    // Verifico che tutte le funzioni GitHub siano state chiamate
    expect(createGitHubService).toHaveBeenCalled()
    expect(mockGitHubService.getScreenshot).toHaveBeenCalled()
    expect(mockGitHubService.getReadme).toHaveBeenCalled()
    expect(mockGitHubService.getPackageJson).toHaveBeenCalled()

    // 2 progetti -> 2 upsert
    expect(mockProjectService.upsert).toHaveBeenCalledTimes(2)

    // Uso expect.objectContaining per verificare SOLO le proprietà
    // che mi interessano, ignorando campi dinamici come errors[]
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      syncedProjects: 2,
      totalProjects: 2,
    }))
  })

  // Test 2: comportamento upsert (aggiorna o crea a seconda dei casi)
  it('usa upsert per aggiornare o creare progetti', async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson)
    mockGitHubService.getScreenshot.mockResolvedValue('https://example.com/screenshot.webp')
    mockGitHubService.getReadme.mockResolvedValue('# Readme')

    mockProjectService.upsert.mockResolvedValue({} as any)

    const { syncRepos } = await import('./syncRepos')
    const handler = getHandler(syncRepos)
    const { req, res, next } = mockReqRes()

    await handler(req, res, next)

    // upsert gestisce internamente create e update,
    // il controller chiama sempre upsert
    expect(mockProjectService.upsert).toHaveBeenCalled()
    expect(mockProjectService.upsert).toHaveBeenCalledTimes(2)
  })

  // Test 3: tutto fallisce — nessun progetto sincronizzato
  it('restituisce errore quando nessun progetto sincronizzato', async () => {
    // La struttura del controller ha un try/catch per ogni progetto.
    // Se getPackageJson e getScreenshot lanciano errore, il singolo
    // progetto viene saltato ma il controller non crasha.
    // Alla fine syncedCount = 0 -> risponde 500.
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    mockGitHubService.getPackageJson.mockRejectedValue(new Error('Fail'))
    mockGitHubService.getScreenshot.mockRejectedValue(new Error('Fail'))

    const { syncRepos } = await import('./syncRepos')
    const handler = getHandler(syncRepos)
    const { req, res, next } = mockReqRes()

    await handler(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Nessun progetto è stato sincronizzato con successo',
    }))
  })

  // Test 4: GitHub API non raggiungibile — errore totale
  it('risponde 500 quando la sincronizzazione fallisce del tutto', async () => {
    // Se getRepositories stesso fallisce, il try/catch ESTERNO
    // del controller cattura l'errore e risponde 500.
    mockGitHubService.getRepositories.mockRejectedValue(new Error('GitHub down'))

    const { syncRepos } = await import('./syncRepos')
    const handler = getHandler(syncRepos)
    const { req, res, next } = mockReqRes()

    await handler(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'GitHub down',
    }))
  })

  // Test 5: invalida cache getRepos dopo sincronizzazione riuscita
  it('invalida la cache getRepos dopo sincronizzazione', async () => {
    mockGitHubService.getRepositories.mockResolvedValue(mockPackages)
    mockGitHubService.getPackageJson.mockResolvedValue(mockPackageJson)
    mockGitHubService.getScreenshot.mockResolvedValue('https://example.com/screenshot.webp')
    mockGitHubService.getReadme.mockResolvedValue('# Readme content')

    mockProjectService.upsert.mockResolvedValue({} as any)

    const { syncRepos } = await import('./syncRepos')
    const handler = getHandler(syncRepos)
    const { req, res, next } = mockReqRes()

    await handler(req, res, next)

    expect(mockCache.invalidate).toHaveBeenCalledWith('github:repos')
  })
})
