import { describe, expect, test } from 'vitest'
import { getLoanPlan, interest, loanData } from './calculator'
const interestRates = [
  {
    from: 0,
    to: 10,
    rate: 0.0001,
  },
  { from: 10, to: 25, rate: 0.0087 },
]

describe('Financial helper functions', () => {
  test.each([
    {
      runtime: 10,
      annuity: 833.7535416568145,
      expected: 100_000,
    },
    {
      runtime: 20,
      annuity: 1135.29507423021,
      expected: 250_000,
    },
  ])('annuity payment', ({ runtime, annuity, expected }) =>
    expect(
      loanData({
        runtime,
        annuity,
        interestRates,
      }).amount,
    ).toBeCloseTo(expected, 5))
  test('totalInterest', () =>
    expect(
      interest({ runtime: 10, annuity: 833.7535416568145, interestRates }),
    ).toBeCloseTo(50.42, 2))
  test.each([
    {
      input: {
        loans: [
          {
            name: 'hansi',
            maxAmount: 50_000,
            interestRates,
            runtime: 10,
          },
        ],
        annuity: 3000,
      },
      expected: {
        loans: [
          {
            annuity: 416.87677,
            amount: 50_000,
            interest: 25.212,
          },
        ],
        totalInterest: 200,
        amount: 50_000,
      },
    },
    {
      input: {
        loans: [
          {
            name: 'hansi',
            maxAmount: 50_000,
            interestRates,
            runtime: 10,
          },
          {
            name: 'hansi',
            interestRates: [
              {
                from: 0,
                to: 100,
                rate: 0.05,
              },
            ],
            runtime: 10,
          },
        ],
        annuity: 3000,
      },
      expected: {
        loans: [
          {
            annuity: 416.87677,
            amount: 50_000,
            interest: 25.212,
          },
          {
            annuity: 2583.12322,
            amount: 243_540.34611,
            interest: 66434.441,
          },
        ],
        totalInterest: 200,
        amount: 293_540.34611,
      },
    },
  ])('multipleLoans', ({ input, expected }) => {
    const result = getLoanPlan(input)
    result.loans.forEach((loan, index) => {
      const expectedLoan = expected.loans[index]
      expect(loan.annuity).toBeCloseTo(expectedLoan.annuity)
      expect(loan.amount).toBeCloseTo(expectedLoan.amount)
      expect(loan.interest).toBeCloseTo(expectedLoan.interest)
    })
    expect(result.totalAmount).toBeCloseTo(expected.amount)
  })
})
