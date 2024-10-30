import { pipe } from 'effect'
import { Field, Formik } from 'formik'

type HeatpumpFormValues = {
  co2PricePerTon: number
  heatpumpInstallationCost: number
  gasheatInstallationCost: number
  electricityPricePerKwh: number
  gasPricePerKwh: number
  heatpumpEfficiency: number
  gasheatEfficiency: number
  consumption: number
  runtimeInYears: number
  co2EmissionElectricity: number
  co2EmissionGas: number
}

export const Heatpump = () => {
  return (
    <Formik<HeatpumpFormValues>
      onSubmit={() => {}}
      initialValues={{
        co2PricePerTon: 65,
        heatpumpInstallationCost: 27500,
        gasheatInstallationCost: 9000,
        co2EmissionElectricity: 380,
        co2EmissionGas: 201,
        electricityPricePerKwh: 0.3,
        gasPricePerKwh: 0.1,
        heatpumpEfficiency: 3,
        gasheatEfficiency: 0.95,
        consumption: 4500,
        runtimeInYears: 20,
      }}
    >
      {({ values }) => (
        <>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
            <NumberInput name='consumption' label='Verbrauch' unit='kWh' />
            <NumberInput
              name='heatpumpEfficiency'
              label='Wirkungsgrad Wärmepumpe'
              unit=''
            />
            <NumberInput
              name='gasheatEfficiency'
              label='Wirkungsgrad Gasheizung'
              unit=''
            />
            <NumberInput
              name='heatpumpInstallationCost'
              label='Installationskosten Wärmepumpe'
              unit='€'
            />
            <NumberInput
              name='gasheatInstallationCost'
              label='Installationskosten Gasheizung'
              unit='€'
            />
            <NumberInput
              name='electricityPricePerKwh'
              label='Strompreis'
              unit='€/kWh'
            />
            <NumberInput name='gasPricePerKwh' label='Gaspreis' unit='€/kWh' />
            <NumberInput name='runtimeInYears' label='Laufzeit' unit='Jahre' />
            <NumberInput name='co2PricePerTon' label='CO2 Preis' unit='€/t' />
            <NumberInput
              name='co2EmissionElectricity'
              label='CO2 Emissionen Strom'
              unit='g/kWh'
            />
            <NumberInput
              name='co2EmissionGas'
              label='CO2 Emissionen Gas'
              unit='g/kWh'
            />
          </div>
          <h2>Wärmepumpe</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Jährlich</th>
                <th>Über {values.runtimeInYears} Jahre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Betriebskosten</td>
                <td>{pipe(values, yearlyRunningCostsHeatpump, formatEuros)}</td>
                <td>{pipe(values, totalRunningCostsHeatpump, formatEuros)}</td>
              </tr>
              <tr>
                <td>Investitionskosten</td>
                <td>
                  {pipe(values, yearlyInvestmentCostsHeatpump, formatEuros)}
                </td>
                <td>{formatEuros(values.heatpumpInstallationCost)}</td>
              </tr>
              <tr className='font-bold'>
                <td>Gesamtkosten</td>
                <td>{pipe(values, yearlyTotalCostsHeatpump, formatEuros)}</td>
                <td>{pipe(values, totalCostsHeatpump, formatEuros)}</td>
              </tr>
              <tr>
                <td>CO₂ Ausstoß</td>
                <td>{pipe(values, yearlyCo2Heatpump, formatTonneCo2)}</td>
                <td>{pipe(values, totalCo2Heatpump, formatTonneCo2)}</td>
              </tr>
            </tbody>
          </table>
          <h2>Gasheizung</h2>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Jährlich</th>
                <th>Über {values.runtimeInYears} Jahre</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Betriebskosten</td>
                <td>{pipe(values, yearlyRunningCostsGasHeat, formatEuros)}</td>
                <td>{pipe(values, totalRunningCostsGasHeat, formatEuros)}</td>
              </tr>
              <tr>
                <td>Investitionskosten</td>
                <td>
                  {pipe(values, yearlyInvestmentCostsGasheat, formatEuros)}
                </td>
                <td>{pipe(values.gasheatInstallationCost, formatEuros)}</td>
              </tr>
              <tr className='font-bold'>
                <td>Gesamtkosten</td>
                <td>{pipe(values, yearlyTotalCostsGasheat, formatEuros)}</td>
                <td>{pipe(values, totalCostsGasheat, formatEuros)}</td>
              </tr>
              <tr>
                <td>CO₂ Ausstoß</td>
                <td>{pipe(values, yearlyCo2Gasheat, formatTonneCo2)}</td>
                <td>{pipe(values, totalCo2Gasheat, formatTonneCo2)}</td>
              </tr>
              <tr>
                <td>
                  <div>Kompensationskosten</div>
                  <div className='text-xs'>
                    des Mehrausstoßes ggü. Wärmepumpe
                  </div>
                </td>
                <td>
                  {formatEuros(
                    yearlyCompensationCostCo2HeatpumpGasheat(values),
                  )}
                </td>
                <td>
                  {pipe(
                    values,
                    totalCompensationCostCo2HeatpumpGasheat,
                    formatEuros,
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <h2>Fazit</h2>
          <p>
            Die Wärmepumpe kostet{' '}
            {pipe(values, totalCostsHeatpump, formatEuros)} und stößt{' '}
            {pipe(values, totalCo2Heatpump, formatTonneCo2)}{' '}
            CO₂ aus. Wenn ich die Gasheizung nutze und den dadurch zusätzlich
            verursachten CO₂ Ausstoß von{' '}
            {pipe(values, totalDifferenceCo2HeatpumpGasheat, formatTonneCo2)}
            {' '}
            kompensieren möchte, kostet mich das insgesamt {formatEuros(
              totalCompensationCostCo2HeatpumpGasheat(values) +
                totalCostsGasheat(values),
            )}
            . Ich kann also{' '}
            {pipe(values, savingsHeatpumpGasheatWithSameEmission, formatEuros)}
            {' '}
            sparen und trotzdem so "wenig" CO₂ ausstoßen wie mit der Wärmepumpe.
          </p>
          <p>
            Würde ich die Ersparnis vollständig für die Kompensation von CO₂
            ausgeben, könnte ich zusätzlich{' '}
            {pipe(values, compensationWithSavings, formatTonneCo2)}{' '}
            CO₂ kompensieren. Gegenüber der Nutzung einer Wärmepumpe würde ich
            also den CO₂ Ausstoß um Faktor {pipe(
              values,
              compensationFactor,
              Intl.NumberFormat('de-DE', {
                style: 'decimal',
                maximumFractionDigits: 2,
              }).format,
            )} reduzieren. Für das gleiche Geld würde ich, anstatt{' '}
            {pipe(values, totalCo2Heatpump, formatTonneCo2)}{' '}
            CO₂ mit der Wärmepumpe auszustoßen, mit der Gasheizung den Ausstoß
            von {pipe(
              compensationWithSavings(values) - totalCo2Gasheat(values),
              formatTonneCo2,
            )} CO₂ verhindern!
          </p>
        </>
      )}
    </Formik>
  )
}

const compensationFactor = (values: HeatpumpFormValues) =>
  compensationWithSavings(values) / totalDifferenceCo2HeatpumpGasheat(values)

const formatTonneCo2 = (value: number) =>
  `${
    Intl.NumberFormat('de-DE', {
      style: 'decimal',
      maximumFractionDigits: 2, // Adjust this as needed for decimal places
    }).format(value)
  } t`

const formatEuros = (value: number) =>
  Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
    value,
  )

const compensationWithSavings = (values: HeatpumpFormValues) =>
  totalCostDifferenceHeatpumpGasheat(values) / values.co2PricePerTon

const savingsHeatpumpGasheatWithSameEmission = (values: HeatpumpFormValues) =>
  totalCostDifferenceHeatpumpGasheat(values) -
  totalCompensationCostCo2HeatpumpGasheat(values)

const totalCostDifferenceHeatpumpGasheat = (values: HeatpumpFormValues) =>
  totalCostsHeatpump(values) - totalCostsGasheat(values)

const totalDifferenceCo2HeatpumpGasheat = (values: HeatpumpFormValues) =>
  totalCo2Gasheat(values) - totalCo2Heatpump(values)

const totalCompensationCostCo2HeatpumpGasheat = (values: HeatpumpFormValues) =>
  totalDifferenceCo2HeatpumpGasheat(values) * values.co2PricePerTon

const yearlyDifferenceCo2HeatpumpGasheat = (values: HeatpumpFormValues) =>
  yearlyCo2Gasheat(values) - yearlyCo2Heatpump(values)

const yearlyCompensationCostCo2HeatpumpGasheat = (values: HeatpumpFormValues) =>
  yearlyDifferenceCo2HeatpumpGasheat(values) * values.co2PricePerTon

const NumberInput = ({
  name,
  label,
  unit,
}: {
  name: string
  label: string
  unit: string
}) => (
  <label className='form-control'>
    <div className='label'>
      <span className='label-text'>{label}</span>
    </div>
    <div className='input input-bordered flex items-center gap-2'>
      <Field name={name} type='number' className='w-full max-w-xs text-right' />
      {unit}
    </div>
  </label>
)

const totalCo2Heatpump = (values: HeatpumpFormValues) =>
  yearlyCo2Heatpump(values) * values.runtimeInYears

const totalCo2Gasheat = (values: HeatpumpFormValues) =>
  yearlyCo2Gasheat(values) * values.runtimeInYears

const totalRunningCostsGasHeat = (values: HeatpumpFormValues) =>
  values.runtimeInYears * yearlyRunningCostsGasHeat(values)

const totalRunningCostsHeatpump = (values: HeatpumpFormValues) =>
  values.runtimeInYears * yearlyRunningCostsHeatpump(values)

const totalCostsHeatpump = (values: HeatpumpFormValues) =>
  values.heatpumpInstallationCost + totalRunningCostsHeatpump(values)

const totalCostsGasheat = (values: HeatpumpFormValues) =>
  values.gasheatInstallationCost +
  values.runtimeInYears *
    yearlyConsumptionGasheat(values) *
    values.gasPricePerKwh

const yearlyConsumptionGasheat = (values: HeatpumpFormValues) =>
  values.consumption / values.gasheatEfficiency

const yearlyConsumptionHeatpump = ({
  consumption,
  heatpumpEfficiency,
}: HeatpumpFormValues) => consumption / heatpumpEfficiency

const yearlyRunningCostsHeatpump = (values: HeatpumpFormValues) =>
  values.electricityPricePerKwh * yearlyConsumptionHeatpump(values)

const yearlyInvestmentCostsHeatpump = ({
  heatpumpInstallationCost,
  runtimeInYears,
}: HeatpumpFormValues) => heatpumpInstallationCost / runtimeInYears

const yearlyTotalCostsHeatpump = (values: HeatpumpFormValues) =>
  yearlyInvestmentCostsHeatpump(values) + yearlyRunningCostsHeatpump(values)

const yearlyRunningCostsGasHeat = (values: HeatpumpFormValues) =>
  values.gasPricePerKwh * yearlyConsumptionGasheat(values)

const yearlyInvestmentCostsGasheat = ({
  gasheatInstallationCost,
  runtimeInYears,
}: HeatpumpFormValues) => gasheatInstallationCost / runtimeInYears

const yearlyTotalCostsGasheat = (values: HeatpumpFormValues) =>
  yearlyInvestmentCostsGasheat(values) + yearlyRunningCostsGasHeat(values)

const yearlyCo2Heatpump = (values: HeatpumpFormValues) =>
  (yearlyConsumptionHeatpump(values) * values.co2EmissionElectricity) /
  1_000_000

const yearlyCo2Gasheat = (values: HeatpumpFormValues) =>
  (yearlyConsumptionGasheat(values) * values.co2EmissionGas) / 1_000_000
