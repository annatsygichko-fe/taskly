import { describe, expect, it } from 'vitest'
import { isValidEmail } from './validation'

describe('isValidEmail', () => {
  it('accepts normal addresses', () => {
    expect(isValidEmail('anna@example.com')).toBe(true)
    expect(isValidEmail('  anna.t@mail.example.org ')).toBe(true)
  })

  it('rejects broken addresses', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('anna')).toBe(false)
    expect(isValidEmail('anna@')).toBe(false)
    expect(isValidEmail('anna@example')).toBe(false)
    expect(isValidEmail('an na@example.com')).toBe(false)
  })
})
