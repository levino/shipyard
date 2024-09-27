import { times, add, max, always, __, T, cond, equals, gt, lte } from 'ramda'
import { pipe } from 'effect'
import * as A from 'effect/Array'

const CERTIFICATES_PER_YEAR_2021 = 1_571_000_000
const AVERAGE_EMISSION_2018_TO_2020 = 43_003_515 / 0.022
const DECREASE_2024 = 90_000_000
const DECREASE_2026 = 27_000_000
const SEA_TRAFFIC = 78_400_000
const DECREASE_OF_NEW_CERTIFICATES_PER_YEAR = {
  2021: AVERAGE_EMISSION_2018_TO_2020 * 0.022,
  2024: AVERAGE_EMISSION_2018_TO_2020 * 0.043,
  2027: AVERAGE_EMISSION_2018_TO_2020 * 0.044,
}
export const sumFromToWith =
  (from: number) => (to: number) => (f: (x: number) => number) =>
    pipe(times(add(from), to - from + 1), A.map(f), A.reduce(0, add))

export const formatNumber = Intl.NumberFormat('de-DE', {
  // no digits after the decimal point
  maximumFractionDigits: 0,
}).format

export const decreaseInNewCertificates: (year: number) => number = cond([
  [lte(__, 2021), always(0)],
  [
    equals(2024),
    always(
      DECREASE_2024 + DECREASE_OF_NEW_CERTIFICATES_PER_YEAR[2024] - SEA_TRAFFIC,
    ),
  ],
  [
    equals(2026),
    always(DECREASE_2026 + DECREASE_OF_NEW_CERTIFICATES_PER_YEAR[2024]),
  ],
  [gt(__, 2027), always(DECREASE_OF_NEW_CERTIFICATES_PER_YEAR[2027])],
  [gt(__, 2024), always(DECREASE_OF_NEW_CERTIFICATES_PER_YEAR[2024])],
  [gt(__, 2021), always(DECREASE_OF_NEW_CERTIFICATES_PER_YEAR[2021])],
  [T, always(0)],
])

export const newCertificates = (year: number) =>
  max(
    0,
    CERTIFICATES_PER_YEAR_2021 -
      sumFromToWith(2021)(year)(decreaseInNewCertificates),
  )

export const totalCertificates = (
  startYear: number,
  startCertificates: number,
) =>
  formatNumber(
    startCertificates + sumFromToWith(startYear)(2100)(newCertificates),
  )
