import { cn } from '../tools/cn'
import { type Entry, SidebarElement } from './SidebarElement'
export interface MobileSidebarProps {
  local?: Entry
  global: Entry
  brand: string
}

export const SidebarNavigation: React.FC<MobileSidebarProps> = ({
  local,
  global,
  brand,
}) => (
  <ul
    className={cn('menu min-h-screen w-56 bg-base-100', {
      'md:hidden': !local,
    })}
  >
    <div>
      <a href='/' className='btn btn-ghost mb-2 text-xl'>
        {brand}
      </a>
    </div>
    <div className='block md:hidden'>
      <li>
        {local
          ? (
            <details>
              <summary>Main menu</summary>
              <SidebarElement entry={global} />
            </details>
          )
          : <SidebarElement entry={global} />}
      </li>
      <div className={cn('divider my-1 block md:hidden', { hidden: !local })} />
    </div>
    {local && <SidebarElement entry={local} />}
  </ul>
)
