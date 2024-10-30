import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import type { CollectionEntry } from 'astro:content'
import type { FC } from 'react'

export const VegetableTable: FC<{
  vegetables: CollectionEntry<'vegetables'>[]
  caption: string
}> = ({ vegetables, caption }) => (
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
      {vegetables.map((vegetable) => (
        <tr key={vegetable.id}>
          <th>
            <a href={`/de/garden/plants/${vegetable.id}`}>
              {vegetable.data.name.latin}
            </a>
          </th>
          <td>{vegetable.data.name.common}</td>
          <td>{vegetable.data.inStock ? <CheckIcon /> : <Cross2Icon />}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
