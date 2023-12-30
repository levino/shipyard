import { Badge } from 'flowbite-react'
import { MdHeight, MdWaterDrop } from 'react-icons/md'
import { FaWater } from 'react-icons/fa'
import { PiCactus } from 'react-icons/pi'
import { BsCircleHalf, BsCircle, BsCircleFill } from 'react-icons/bs'

import { IoFlowerOutline } from 'react-icons/io5'
import { RiSeedlingLine } from 'react-icons/ri'
import { type CollectionEntry } from 'astro:content'
import { MONTHS_DE, MONTHS_EN } from 'src/types'
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
      <div className="flex flex-wrap gap-2">
        {plant.data.images.map((image, index) => (
          <img key={index} src={image.src.src} alt={image.alt} />
        ))}
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
          return <ExposureBadge sunExposure={sunExposure} />
        }
        return (
          <>
            oder <ExposureBadge sunExposure={sunExposure} />
          </>
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
      return (
        <Badge className="bg-yellow-100" icon={BsCircle}>
          sonnig
        </Badge>
      )
    case 'semi-shade':
      return (
        <Badge className="bg-yellow-100" icon={BsCircleHalf}>
          halbschattig
        </Badge>
      )
    case 'shade':
      return (
        <Badge className="bg-blue-100" icon={BsCircleFill}>
          schattig
        </Badge>
      )
  }
}

const Soil: FC<Props> = ({ plant }) => (
  <div className="flex flex-col gap-2 py-4">
    <p className="text-sm text-slate-600">Boden</p>
    <div className="flex gap-2">
      {plant.data.soil.includes('moist') && (
        <Badge className="bg-blue-100" icon={MdWaterDrop}>
          feucht
        </Badge>
      )}
      {plant.data.soil.includes('dry') && (
        <Badge className="bg-yellow-100" icon={PiCactus}>
          trocken
        </Badge>
      )}
      {plant.data.soil.includes('normal') && (
        <Badge className="rounded-full bg-green-100 px-2.5 py-1.5">
          normal
        </Badge>
      )}
      {plant.data.soil.includes('wet') && (
        <Badge className="bg-blue-200" icon={FaWater}>
          nass
        </Badge>
      )}
    </div>
  </div>
)

const Dimensions: FC<Props> = ({ plant }) => (
  <div className="flex flex-col gap-2 py-4">
    <p className="text-sm text-slate-600">Größe</p>
    <div className="flex gap-2">
      <Badge icon={MdHeight}>{plant.data.height} cm</Badge>
      <Badge icon={() => <MdHeight className="rotate-90" />}>
        {plant.data.spread} cm
      </Badge>
    </div>
  </div>
)

const PlantTable: FC<Props> = ({ plant }) => (
  <div className="px-4">
    <table className="w-full table-fixed border-collapse rounded border border-slate-400">
      <thead>
        <tr>
          {MONTHS_DE.map((month, key) => (
            <th key={key} className="border border-slate-400 py-2 font-normal">
              {month.slice(0, 3)}
            </th>
          ))}
        </tr>
        <tbody>
          <tr>
            {MONTHS_EN.map((month, key) => {
              if (plant.data.floweringSeason.includes(month)) {
                return (
                  <td key={key} className="border border-slate-400 py-2">
                    <IoFlowerOutline className="mx-auto" />
                  </td>
                )
              }
              return <td key={key} className="border border-slate-400 py-2" />
            })}
          </tr>
          <tr>
            {MONTHS_EN.map((month) => {
              if (plant.data.sowingTime?.includes(month)) {
                return (
                  <td className="border border-slate-400 py-2">
                    <RiSeedlingLine className="mx-auto" />
                  </td>
                )
              }
              return <td className="border border-slate-400 py-2" />
            })}
          </tr>
        </tbody>
      </thead>
    </table>
  </div>
)
