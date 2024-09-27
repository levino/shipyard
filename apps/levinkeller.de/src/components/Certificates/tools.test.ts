import { describe, expect, test } from 'vitest'
import { newCertificates } from './tools'
describe('tools', () => {
  describe('newCertificates', () => {
    test.each`
      year    | certificates
      ${2021} | ${1_571_000_000}
      ${2022} | ${1_527_996_485}
      ${2041} | ${0}
    `(
      'In year $year there are $certificates new certificates',
      ({ year, certificates }) =>
        expect(newCertificates(year)).toBe(certificates),
    )
  })
})
