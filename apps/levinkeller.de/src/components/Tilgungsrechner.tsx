import React from 'react'
import { getLoanPlan, type LoansSpecs } from '../tools/calculator'
import { pipe } from 'fp-ts/lib/function'
import { Field, Formik } from 'formik'

type Runtime = 10 | 15 | 20 | 25 | 30 | 35
interface FormValues {
  bankInterestRate: number
  monthlyIncome: number
  kfwRuntime: Runtime
  bankRuntime: Runtime
}

export const Tilgungsrechner: React.FC = () => {
  return (
    <Formik<FormValues>
      onSubmit={() => void 0}
      initialValues={{
        monthlyIncome: 3000,
        bankInterestRate: 4.4,
        kfwRuntime: 20,
        bankRuntime: 20,
      }}
    >
      {({
        values: { monthlyIncome, bankInterestRate, kfwRuntime, bankRuntime },
      }) => {
        const loansSpecs: LoansSpecs = {
          loans: [
            { ...kfwLoan, runtime: kfwRuntime },
            {
              name: 'Bank',
              interestRates: [
                { from: 0, to: 100, rate: bankInterestRate / 100 },
              ],
              runtime: bankRuntime,
            },
          ],
          annuity: 0.35 * monthlyIncome,
        }
        const loanPlan = getLoanPlan(loansSpecs)
        return (
          <div className='grid grid-cols-1 gap-6'>
            <div className='grid grid-cols-3 gap-6'>
              <label className='block'>
                <span>Monatlich verfügbares Einkommen</span>
                <Field
                  type='number'
                  className='form-input block'
                  name='monthlyIncome'
                  step='100'
                />
              </label>
            </div>
            <div>
              <h3>KfW Kredit</h3>
              <label className='block'>
                <span>Tilgung in Jahren</span>
                <Field className='block' as='select' name='kfwRuntime'>
                  <option value='10'>10</option>
                  <option value='15'>15</option>
                  <option value='20'>20</option>
                  <option value='25'>25</option>
                  <option value='30'>30</option>
                  <option value='35'>35</option>
                </Field>
              </label>
            </div>

            <div>
              <h3>Bankkredit</h3>
              <div className='grid grid-cols-3'>
                <label className='block'>
                  <span>Tilgung in Jahren</span>
                  <Field className='block' as='select' name='bankRuntime'>
                    <option value='10'>10</option>
                    <option value='15'>15</option>
                    <option value='20'>20</option>
                    <option value='25'>25</option>
                    <option value='30'>30</option>
                    <option value='35'>35</option>
                  </Field>
                </label>
                <label className='block'>
                  <span>Bankzinsen in Prozent</span>
                  <Field
                    className='block'
                    type='number'
                    step='0.1'
                    name='bankInterestRate'
                  />
                </label>
              </div>
            </div>
            <table>
              <tr>
                <th>Kredit</th>
                <th>Kredithöhe</th>
                <th>Laufzeit</th>
                <th>Tilgungsrate</th>
                <th>Gesamtzinsen</th>
              </tr>
              {loanPlan.loans.map((loan, index) => (
                <tr key={index}>
                  <td>{loan.name}</td>
                  <td className='text-right'>
                    {pipe(loan.amount, euro.format)}
                  </td>
                  <td>{loan.runtime} Jahre</td>
                  <td className='text-right'>
                    {pipe(loan.annuity, euro.format)}
                  </td>
                  <td className='text-right'>
                    {pipe(loan.interest, euro.format)}
                  </td>
                </tr>
              ))}
              <tr className='font-bold'>
                <td>Gesamt</td>
                <td className='text-right'>
                  {pipe(loanPlan.totalAmount, euro.format)}
                </td>
                <td></td>
                <td className='text-right'>
                  {pipe(loanPlan.annuity, euro.format)}
                </td>
                <td className='text-right'>
                  {pipe(loanPlan.totalInterest, euro.format)}
                </td>
              </tr>
            </table>
          </div>
        )
      }}
    </Formik>
  )
}

const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
})

const kfwLoan = {
  name: 'KfW',
  interestRates: [
    {
      from: 0,
      to: 10,
      rate: 0.0001,
    },
    { from: 10, to: 25, rate: 0.0087 },
    { from: 25, to: 35, rate: 0.0111 },
  ],
  maxAmount: 150_000,
}
