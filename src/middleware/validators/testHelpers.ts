import { ValidationChain, validationResult } from 'express-validator'

// ──────────────────────────────────────────────
// Helper condiviso per i test dei validatori
// ──────────────────────────────────────────────
// Esegue ogni validatore sul req e restituisce i risultati.
// express-validator funziona in modo diverso dai middleware normali:
// ogni validatore va eseguito manualmente con v.run(req), poi si
// controllano gli errori con validationResult(req).

export async function runValidation(
  req: Record<string, unknown>,
  validations: ValidationChain[]
) {
  for (const v of validations) {
    await v.run(req as any)
  }
  return validationResult(req as any)
}
