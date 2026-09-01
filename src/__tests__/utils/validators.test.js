import { describe, it, expect } from 'vitest'
import { isValidPhone } from '../../utils/validators'

describe('isValidPhone', () => {
  it('accepts a valid phone number', () => {
    expect(isValidPhone('0712345678')).toBe(true)
  })

  it('accepts a valid phone number with country code', () => {
    expect(isValidPhone('+254712345678')).toBe(true)
  })

  it('rejects an empty value', () => {
    expect(isValidPhone('')).toBe(false)
  })

  it('rejects a value with letters', () => {
    expect(isValidPhone('07abc45678')).toBe(false)
  })
})
