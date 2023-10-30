interface InterestRatePeriod {
  from: number

  to: number
  rate: number
}
interface LoanSpecs {
  annuity: number
  /**
   * Time in years until the loan is paid back in full.
   */
  runtime: number
  maxAmount?: number
  interestRates: InterestRatePeriod[]
}

const inRange = (low: number, high: number) => (value: number) =>
  value > low && value <= high

const interestRate = (loanSpecs: {
  interestRates: InterestRatePeriod[]
  runtime: number
}): number => {
  for (const interestRate of loanSpecs.interestRates) {
    if (inRange(interestRate.from, interestRate.to)(loanSpecs.runtime)) {
      return interestRate.rate
    }
  }
  throw new Error('runtime not reflected in the interest rates array.')
}

const getAnnuity = (specs: {
  runtime: number
  amount: number
  interestRates: InterestRatePeriod[]
}) => {
  const rate = interestRate(specs) / 12
  const periods = specs.runtime * 12
  const term = Math.pow(1 + rate, periods)
  return (specs.amount * (term * rate)) / (term - 1)
}

export const loanData = ({
  runtime,
  maxAmount,
  interestRates,
  annuity,
}: LoanSpecs): { amount: number; annuity: number } => {
  const rate = interestRate({ runtime, interestRates }) / 12
  const periods = runtime * 12

  const term = Math.pow(1 + rate, periods)
  const theoreticalAmount = (annuity * (term - 1)) / (term * rate)
  if (maxAmount && theoreticalAmount > maxAmount) {
    return {
      amount: maxAmount,
      annuity: getAnnuity({ runtime, amount: maxAmount, interestRates }),
    }
  }

  return {
    amount: theoreticalAmount,
    annuity: annuity,
  }
}

export const interest = (specs: LoanSpecs) =>
  loanData(specs).annuity * specs.runtime * 12 - loanData(specs).amount

export interface LoansSpecs {
  loans: {
    name: string
    interestRates: InterestRatePeriod[]
    maxAmount?: number
    runtime: number
  }[]
  annuity: number
}

interface LoanPlan {
  amount: number
  interest: number
  annuity: number
  runtime: number
  name: string
}

export const getLoanPlan = (
  loansSpecs: LoansSpecs
): {
  loans: LoanPlan[]
  totalInterest: number
  totalAmount: number
  annuity: number
} =>
  loansSpecs.loans.reduce(
    (acc, { interestRates, maxAmount, runtime, name }) => {
      const leftoverAnnuity = loansSpecs.annuity - acc.annuity
      if (leftoverAnnuity <= 0) {
        return acc
      }
      const loanSpecs = {
        annuity: leftoverAnnuity,
        interestRates,
        maxAmount,
        runtime,
      }
      return {
        loans: [
          ...acc.loans,
          {
            name,
            runtime,
            amount: loanData(loanSpecs).amount,
            interest: interest(loanSpecs),
            annuity: loanData(loanSpecs).annuity,
          },
        ],
        annuity: acc.annuity + loanData(loanSpecs).annuity,
        totalAmount: acc.totalAmount + loanData(loanSpecs).amount,
        totalInterest: acc.totalInterest + interest(loanSpecs),
      }
    },
    {
      loans: [] as LoanPlan[],
      totalInterest: 0,
      totalAmount: 0,
      annuity: 0,
    }
  )
