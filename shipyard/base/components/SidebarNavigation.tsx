import { SidebarElement, type Entry } from './SidebarElement'
export interface MobileSidebarProps {
  local: Entry
  global: Entry
}

export const SidebarNavigation: React.FC<MobileSidebarProps> = ({
  local,
  global,
}) => (
  <ul className="menu w-56 bg-base-200">
    <div className="block md:hidden">
      <li>
        <details>
          <summary>Main menu</summary>
          <SidebarElement entry={global} />
        </details>
      </li>
      <div className="divider my-1" />
    </div>
    <SidebarElement entry={local} />
  </ul>
)
