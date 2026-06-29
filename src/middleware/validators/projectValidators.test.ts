import { describe, expect, it } from 'vitest'
import { validationResult } from 'express-validator'
import {
  createProjectValidator,
  updateProjectValidator,
  idValidator,
} from './projectValidators'

async function runValidation(req: Record<string, unknown>, validations: ReturnType<typeof createProjectValidator>) {
  for (const v of validations) {
    await v.run(req)
  }
  return validationResult(req)
}

describe('createProjectValidator', () => {
  const validBody = {
    name: 'My Project',
    link: 'https://example.com',
    image: 'https://example.com/img.png',
    technologies: ['React'],
    description: 'A cool project',
  }

  it('passa con dati validi', async () => {
    const result = await runValidation({ body: validBody }, createProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce quando name mancante', async () => {
    const { name, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.isEmpty()).toBe(false)
    expect(result.array().some(e => e.msg === 'Il nome è obbligatorio')).toBe(true)
  })

  it('fallisce quando link mancante', async () => {
    const { link, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.array().some(e => e.msg === 'Il link è obbligatorio')).toBe(true)
  })

  it('fallisce quando link non è un URL', async () => {
    const result = await runValidation({ body: { ...validBody, link: 'not-a-url' } }, createProjectValidator)
    expect(result.array().some(e => e.msg.toLowerCase().includes('url'))).toBe(true)
  })

  it('fallisce quando image mancante', async () => {
    const { image, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.array().some(e => e.msg.includes('immagine'))).toBe(true)
  })

  it('fallisce quando technologies non è un array', async () => {
    const result = await runValidation({ body: { ...validBody, technologies: 'React' } }, createProjectValidator)
    expect(result.array().some(e => e.msg.includes('array'))).toBe(true)
  })

  it('non intercetta array vuoto (notEmpty ignora gli array)', async () => {
    const result = await runValidation({ body: { ...validBody, technologies: [] } }, createProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce quando description mancante', async () => {
    const { description, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.array().some(e => e.msg.includes('descrizione'))).toBe(true)
  })
})

describe('updateProjectValidator', () => {
  const validParams = { id: '507f1f77bcf86cd799439011' }
  const validBody = { name: 'Updated', technologies: ['Node'] }

  it('passa con id valido e body opzionale', async () => {
    const result = await runValidation({ params: validParams, body: validBody }, updateProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('passa con id valido e body vuoto', async () => {
    const result = await runValidation({ params: validParams, body: {} }, updateProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce quando id non è un MongoId valido', async () => {
    const result = await runValidation({ params: { id: 'invalid' }, body: {} }, updateProjectValidator)
    expect(result.array().some(e => e.msg === 'ID non valido')).toBe(true)
  })

  it('fallisce quando name non è una stringa', async () => {
    const result = await runValidation({ params: validParams, body: { name: 123 } }, updateProjectValidator)
    expect(result.array().some(e => e.msg.includes('stringa'))).toBe(true)
  })
})

describe('idValidator', () => {
  it('passa con un MongoId valido', async () => {
    const result = await runValidation({ params: { id: '507f1f77bcf86cd799439011' } }, idValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fallisce con id non valido', async () => {
    const result = await runValidation({ params: { id: 'invalid' } }, idValidator)
    expect(result.array().some(e => e.msg === 'ID non valido')).toBe(true)
  })

  it('fallisce quando id mancante', async () => {
    const result = await runValidation({ params: {} }, idValidator)
    expect(result.isEmpty()).toBe(false)
  })
})
