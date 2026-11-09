import { describe, expect, it } from 'vitest'
import { todayYmd } from './date'

describe('todayYmd', () => {
  it('returns a YYYY-MM-DD string', () => {
    expect(todayYmd()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
