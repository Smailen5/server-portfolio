import { describe, expect, it, vi } from 'vitest'

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

vi.mock('../../utils/githubUtils', () => ({
  // vi.fn() crea una funzione "fantoccio" che non fa nulla.
  // In ogni test decideremo cosa deve restituire.
  getProjectsFromGithub: vi.fn(),
  getPackageJson: vi.fn(),
}))

// Importiamo i mock DOPO i vi.mock() (vitest li sposta in alto automaticamente)
import { getProjectsFromGithub, getPackageJson } from '../../utils/githubUtils'

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
  // Test 1: percorso felice — GitHub risponde, tutto ok
  it('returns package info for each folder', async () => {
    // Predispongo i mock: dico loro cosa restituire
    vi.mocked(getProjectsFromGithub).mockResolvedValue(mockPackages)
    vi.mocked(getPackageJson).mockResolvedValue(mockPackageJson)

    // Importo il controller DOPO aver configurato i mock.
    // L'import dinamico (await import) è fondamentale:
    // se importassi in cima al file, i mock non sarebbero
    // ancora pronti al momento dell'import.
    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    // Eseguo il controller come farebbe Express
    await getRepos(req, res, next)

    // Verifico che abbia chiamato le funzioni mockate
    expect(getProjectsFromGithub).toHaveBeenCalled()
    expect(getPackageJson).toHaveBeenCalledTimes(2) // una per cartella

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
  it('falls back to folder name when package.json is missing', async () => {
    vi.mocked(getProjectsFromGithub).mockResolvedValue(mockPackages)
    // getPackageJson restituisce null → simula cartella senza package.json
    vi.mocked(getPackageJson).mockResolvedValue(null)

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
  it('responds 500 when GitHub API fails', async () => {
    // mockRejectedValue simula un'eccezione (Promise rifiutata)
    vi.mocked(getProjectsFromGithub).mockRejectedValue(new Error('API rate limit'))

    const { getRepos } = await import('./getRepos')
    const { req, res, next } = mockReqRes()

    await getRepos(req, res, next)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'API rate limit' })
  })
})
