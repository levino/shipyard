import { add, times } from 'ramda'
import { pipe } from 'effect'
import * as A from 'effect/Array'
import {
  decreaseInNewCertificates,
  formatNumber,
  newCertificates,
  sumFromToWith,
} from './tools'

interface CertificateTableProps {
  initialCertificates: number
  startYear: number
  years: number
}

export const CertificateTable: React.FC<CertificateTableProps> = ({
  initialCertificates,
  startYear,
  years,
}) => (
  <div className='not-prose h-96 overflow-x-auto'>
    <table className='table table-pin-rows'>
      <thead>
        <tr>
          <th>Jahr</th>
          <th>Verringerung</th>
          <th>Neue Zertifikate</th>
          <th>Gesamtzertifikate</th>
        </tr>
      </thead>
      <tbody>
        {pipe(
          times(add(startYear), years),
          A.map((year) => (
            <tr key={year}>
              <td>{year}</td>
              <td>{formatNumber(decreaseInNewCertificates(year))}</td>
              <td>{pipe(year, newCertificates, formatNumber)}</td>
              <td>
                {formatNumber(
                  initialCertificates +
                    sumFromToWith(startYear)(year)(newCertificates),
                )}
              </td>
            </tr>
          )),
        )}
      </tbody>
    </table>
  </div>
)
