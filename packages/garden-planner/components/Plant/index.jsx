import { type CollectionEntry } from 'astro:content'
import { MONTHS_DE, MONTHS_EN } from '@levino/shipyard-base'
import type { FC, PropsWithChildren } from 'react'
import {
  IconCactus,
  IconDroplet,
  IconDropletFilled,
  IconDropletHalf2Filled,
  IconFlower,
  IconMoon,
  IconSeeding,
  IconSun,
  IconSunMoon,
} from '@tabler/icons-react'
type Props = { plant: CollectionEntry<'plants'> }

export const Plant: FC<PropsWithChildren<Props>> = ({ plant, children }) => (
  <div className='py-4'>
    <h1 className='text-3xl font-bold'>{plant.data.name.latin}</h1>
    <h2 className='text-xl'>{plant.data.name.german}</h2>
    <div className='stats shadow'>
      <Dimensions plant={plant} />
      <Soil plant={plant} />
      <Sun plant={plant} />
    </div>
    {plant.data.images && (
      <div className='carousel aspect-[4/3] rounded-box'>
        {plant.data.images.map((image, index) => (
          <div className='carousel-item aspect-[4/3]' key={index}>
            <img
              className='w-full object-cover'
              src={image.src.src}
              alt={image.alt}
            />
          </div>
        ))}
      </div>
    )}
    <PlantTable plant={plant} />
    <div className='py-4'>{children}</div>
  </div>
)

const Sun: FC<Props> = ({ plant }) => (
  <div className='stat'>
    <div className='stat-title'>Sonne</div>
    <div className='stat-value'>
      {plant.data.sunExposure.map((sunExposure, key) => (
        <ExposureBadge key={key} sunExposure={sunExposure} />
      ))}
    </div>
  </div>
)

const ExposureBadge: FC<{ sunExposure: 'full' | 'semi-shade' | 'shade' }> = ({
  sunExposure,
}) => {
  switch (sunExposure) {
    case 'full':
      return (
        <div className='tooltip' data-tip='sonnig'>
          <IconSun />
        </div>
      )
    case 'semi-shade':
      return (
        <div className='tooltip' data-tip='halbschattig'>
          <IconSunMoon />
        </div>
      )
    case 'shade':
      return (
        <div className='tooltip' data-tip='schattig'>
          <IconMoon />
        </div>
      )
  }
}

const Soil: FC<Props> = ({ plant }) => (
  <div className='stat'>
    <div className='stat-title'>Boden</div>
    <div className='stat-value'>
      {plant.data.soil.includes('moist') && (
        <div className='tooltip' data-tip='feucht'>
          <IconDropletHalf2Filled />
        </div>
      )}
      {plant.data.soil.includes('dry') && (
        <div className='tooltip' data-tip='trocken'>
          <IconCactus />
        </div>
      )}
      {plant.data.soil.includes('normal') && (
        <div className='tooltip' data-tip='normal'>
          <IconDroplet />
        </div>
      )}
      {plant.data.soil.includes('wet') && (
        <div className='tooltip' data-tip='nass'>
          <IconDropletFilled />
        </div>
      )}
    </div>
  </div>
)

const Dimensions: FC<Props> = ({ plant }) => [
  <div id='height' className='stat'>
    <div className='stat-title'>Höhe</div>
    <div className='stat-value'>{plant.data.height} cm</div>
  </div>,
  <div id='spread' className='stat'>
    <div className='stat-title'>Breite</div>
    <div className='stat-value'>{plant.data.spread} cm</div>
  </div>,
]

const PlantTable: FC<Props> = ({ plant }) => (
  <div className='p-4'>
    <table className='w-full table-fixed border-collapse rounded border border-slate-400'>
      <thead>
        <tr>
          {MONTHS_DE.map((month, key) => (
            <th
              key={key}
              className='border border-slate-400 py-2 text-center font-normal'
            >
              <span className='hidden md:block'>{month.slice(0, 3)}</span>
              <span className='md:hidden'>{month.slice(0, 1)}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {MONTHS_EN.map((month, key) => {
            if (plant.data.floweringSeason.includes(month)) {
              return (
                <td key={key} className='border border-slate-400 py-2'>
                  <IconFlower className='mx-auto' />
                </td>
              )
            }
            return <td key={key} className='border border-slate-400 py-2' />
          })}
        </tr>
        <tr>
          {MONTHS_EN.map((month, key) => {
            if (plant.data.sowingTime?.includes(month)) {
              return (
                <td key={key} className='border border-slate-400 py-2'>
                  <IconSeeding className='mx-auto' />
                </td>
              )
            }
            return <td key={key} className='border border-slate-400 py-2' />
          })}
        </tr>
      </tbody>
    </table>
  </div>
)
