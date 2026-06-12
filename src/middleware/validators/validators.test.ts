import { describe, expect, it } from 'vitest'
import { validationResult } from 'express-validator'
import {
  createProjectValidator,
  updateProjectValidator,
  idValidator,
  syncValidator,
  validateLoginInput,
} from './validators'

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

  it('passes with valid data', async () => {
    const result = await runValidation({ body: validBody }, createProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fails when name is missing', async () => {
    const { name, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.isEmpty()).toBe(false)
    expect(result.array().some(e => e.msg === 'Il nome è obbligatorio')).toBe(true)
  })

  it('fails when link is missing', async () => {
    const { link, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.array().some(e => e.msg === 'Il link è obbligatorio')).toBe(true)
  })

  it('fails when link is not a URL', async () => {
    const result = await runValidation({ body: { ...validBody, link: 'not-a-url' } }, createProjectValidator)
    expect(result.array().some(e => e.msg.toLowerCase().includes('url'))).toBe(true)
  })

  it('fails when image is missing', async () => {
    const { image, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.array().some(e => e.msg.includes('immagine'))).toBe(true)
  })

  it('fails when technologies is not an array', async () => {
    const result = await runValidation({ body: { ...validBody, technologies: 'React' } }, createProjectValidator)
    expect(result.array().some(e => e.msg.includes('array'))).toBe(true)
  })

  it('does not catch empty array (notEmpty ignores arrays)', async () => {
    const result = await runValidation({ body: { ...validBody, technologies: [] } }, createProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fails when description is missing', async () => {
    const { description, ...body } = validBody
    const result = await runValidation({ body }, createProjectValidator)
    expect(result.array().some(e => e.msg.includes('descrizione'))).toBe(true)
  })
})

describe('updateProjectValidator', () => {
  const validParams = { id: '507f1f77bcf86cd799439011' }
  const validBody = { name: 'Updated', technologies: ['Node'] }

  it('passes with valid id and optional body', async () => {
    const result = await runValidation({ params: validParams, body: validBody }, updateProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('passes with valid id and empty body', async () => {
    const result = await runValidation({ params: validParams, body: {} }, updateProjectValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fails when id is not a valid MongoId', async () => {
    const result = await runValidation({ params: { id: 'invalid' }, body: {} }, updateProjectValidator)
    expect(result.array().some(e => e.msg === 'ID non valido')).toBe(true)
  })

  it('fails when name is not a string', async () => {
    const result = await runValidation({ params: validParams, body: { name: 123 } }, updateProjectValidator)
    expect(result.array().some(e => e.msg.includes('stringa'))).toBe(true)
  })
})

describe('idValidator', () => {
  it('passes with a valid MongoId', async () => {
    const result = await runValidation({ params: { id: '507f1f77bcf86cd799439011' } }, idValidator)
    expect(result.isEmpty()).toBe(true)
  })

  it('fails with an invalid id', async () => {
    const result = await runValidation({ params: { id: 'invalid' } }, idValidator)
    expect(result.array().some(e => e.msg === 'ID non valido')).toBe(true)
  })

  it('fails when id is missing', async () => {
    const result = await runValidation({ params: {} }, idValidator)
    expect(result.isEmpty()).toBe(false)
  })
})

describe('syncValidator', () => {
  it('passes with a valid API key header', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'AbcDefGhiJk1MnoPqrSt' } },
      syncValidator
    )
    expect(result.isEmpty()).toBe(true)
  })

  it('fails when x-api-key is missing', async () => {
    const result = await runValidation({ headers: {} }, syncValidator)
    expect(result.array().some(e => e.msg.includes('chiave'))).toBe(true)
  })

  it('fails when key is too short', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'short' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('caratteri'))).toBe(true)
  })

  it('fails when key has no uppercase letters', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'abcdefghijklmnopqrst' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('maiuscole'))).toBe(true)
  })

  it('fails when key has no lowercase letters', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'ABCDEFGHIJKLMNOPQRST' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('minuscole'))).toBe(true)
  })

  it('fails when key has no numbers', async () => {
    const result = await runValidation(
      { headers: { 'x-api-key': 'Abcdefghijklmnopqrst' } },
      syncValidator
    )
    expect(result.array().some(e => e.msg.includes('numeri'))).toBe(true)
  })
})

describe('validateLoginInput', () => {
  it('passes with valid email and password', async () => {
    const result = await runValidation(
      { body: { email: 'test@example.com', password: 'password123' } },
      validateLoginInput
    )
    expect(result.isEmpty()).toBe(true)
  })

  it('fails when email is missing', async () => {
    const result = await runValidation({ body: { password: 'password123' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })

  it('fails with invalid email format', async () => {
    const result = await runValidation({ body: { email: 'not-an-email', password: 'password123' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('email'))).toBe(true)
  })

  it('fails when password is missing', async () => {
    const result = await runValidation({ body: { email: 'test@example.com' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('password'))).toBe(true)
  })

  it('fails when password is too short', async () => {
    const result = await runValidation({ body: { email: 'test@example.com', password: '12' } }, validateLoginInput)
    expect(result.array().some(e => e.msg.includes('almeno 6'))).toBe(true)
  })
})
