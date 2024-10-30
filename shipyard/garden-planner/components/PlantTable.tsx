import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import type { CollectionEntry } from 'astro:content'
import type { FC } from 'react'

export const PlantTable: FC<{
  plants: CollectionEntry<'plants'>[]
  caption: string
}> = ({ plants, caption }) => (
  <table className='table'>
    <p>{caption}</p>
    <thead>
      <tr>
        <th>Name</th>
        <th>deutscher Name</th>
        <th>vorrätig</th>
      </tr>
    </thead>
    <tbody>
      {plants.map((plant) => (
        <tr key={plant.id}>
          <th>
            <a href={`/de/garden/plants/${plant.id}`}>
              {plant.data.name.latin}
            </a>
          </th>
          <td>{plant.data.name.german}</td>
          <td>{plant.data.inStock ? <CheckIcon /> : <Cross2Icon />}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
