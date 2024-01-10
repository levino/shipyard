import { type CollectionEntry } from 'astro:content'
import { MONTHS_DE, MONTHS_EN } from '@shipyard/base/src/types'
import type { PropsWithChildren, FC } from 'react'

type Props = { plant: CollectionEntry<'plants'> }

export const Plant: FC<PropsWithChildren<Props>> = ({ plant, children }) => (
  <div className="py-4">
    <h1 className="text-3xl font-bold">{plant.data.name.latin}</h1>
    <h2 className="text-xl">{plant.data.name.german}</h2>
    <div className="flex flex-wrap gap-2">
      <Dimensions plant={plant} />
      <Soil plant={plant} />
      <Sun plant={plant} />
    </div>
    {plant.data.images && (
      <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
        <div>
          {plant.data.images.map((image, index) => (
            <img key={index} src={image.src.src} alt={image.alt} />
          ))}
        </div>
      </div>
    )}
    <PlantTable plant={plant} />
    <div className="py-4">{children}</div>
  </div>
)

const Sun: FC<Props> = ({ plant }) => (
  <div className="flex flex-col gap-2 py-4">
    <div className="flex gap-2">
      Steht gerne
      {plant.data.sunExposure.map((sunExposure, key) => {
        if (key === 0) {
          return <ExposureBadge key={key} sunExposure={sunExposure} />
        }
        if (key < plant.data.sunExposure.length - 1) {
          return (
            <span className="flex gap-2" key={key}>
              , <ExposureBadge sunExposure={sunExposure} />
            </span>
          )
        }
        return (
          <span className="flex gap-2" key={key}>
            oder <ExposureBadge sunExposure={sunExposure} />
          </span>
        )
      })}
    </div>
  </div>
)

const ExposureBadge: FC<{ sunExposure: 'full' | 'semi-shade' | 'shade' }> = ({
  sunExposure,
}) => {
  switch (sunExposure) {
    case 'full':
      return <div className="bg-yellow-100">sonnig</div>
    case 'semi-shade':
      return <div className="bg-yellow-100">halbschattig</div>
    case 'shade':
      return <div className="bg-blue-100">schattig</div>
  }
}

const Soil: FC<Props> = ({ plant }) => (
  <div className="flex flex-col gap-2 py-4">
    <p className="text-sm text-slate-600">Boden</p>
    <div className="flex gap-2">
      {plant.data.soil.includes('moist') && (
        <div className="bg-blue-100">feucht</div>
      )}
      {plant.data.soil.includes('dry') && (
        <div className="bg-yellow-100">trocken</div>
      )}
      {plant.data.soil.includes('normal') && (
        <div className="rounded-full bg-green-100 px-2.5 py-1.5">normal</div>
      )}
      {plant.data.soil.includes('wet') && (
        <div className="bg-blue-200">nass</div>
      )}
    </div>
  </div>
)

const Dimensions: FC<Props> = ({ plant }) => (
  <div className="flex flex-col gap-2 py-4">
    <p className="text-sm text-slate-600">Größe</p>
    <div className="flex gap-2">
      <div>{plant.data.height} cm</div>
      <div>{plant.data.spread} cm</div>
    </div>
  </div>
)

const PlantTable: FC<Props> = ({ plant }) => (
  <div className="p-4">
    <table className="w-full table-fixed border-collapse rounded border border-slate-400">
      <thead>
        <tr>
          {MONTHS_DE.map((month, key) => (
            <th key={key} className="border border-slate-400 py-2 font-normal">
              <span className="hidden md:block">{month.slice(0, 3)}</span>
              <span className="md:hidden">{month.slice(0, 1)}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {MONTHS_EN.map((month, key) => {
            if (plant.data.floweringSeason.includes(month)) {
              return (
                <td key={key} className="border border-slate-400 py-2">
                  <div className="mx-auto" />
                </td>
              )
            }
            return <td key={key} className="border border-slate-400 py-2" />
          })}
        </tr>
        <tr>
          {MONTHS_EN.map((month, key) => {
            if (plant.data.sowingTime?.includes(month)) {
              return (
                <td key={key} className="border border-slate-400 py-2">
                  <div className="mx-auto" />
                </td>
              )
            }
            return <td key={key} className="border border-slate-400 py-2" />
          })}
        </tr>
      </tbody>
    </table>
  </div>
)
