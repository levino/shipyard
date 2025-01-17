import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';
export const PlantTable = ({ plants, caption }) => (<table className='table'>
    <p>{caption}</p>
    <thead>
      <tr>
        <th>Name</th>
        <th>deutscher Name</th>
        <th>vorrätig</th>
      </tr>
    </thead>
    <tbody>
      {plants.map((plant) => (<tr key={plant.id}>
          <th>
            <a href={`/de/garden/plants/${plant.id}`}>
              {plant.data.name.latin}
            </a>
          </th>
          <td>{plant.data.name.german}</td>
          <td>{plant.data.inStock ? <CheckIcon /> : <Cross2Icon />}</td>
        </tr>))}
    </tbody>
  </table>);
