import { cn } from '@/lib/utils'
import { SidebarElement, type Entry } from './SidebarElement'
import { useState } from 'react'

export const MobileSidebar = ({
  local,
  global,
}: {
  local: Entry
  global: Entry
}) => {
  const [shouldShowGlobal, setShowGlobal] = useState(false)
  const showGlobal = () => setShowGlobal(true)
  return (
    <div className="h-full w-40">
      <div
        className={cn(
          { 'left-0': shouldShowGlobal },
          { '-left-40': !shouldShowGlobal },
          'absolute z-20 h-full w-40 bg-white pl-2 transition-all duration-500',
        )}
      >
        <SidebarElement entry={global} />
      </div>

      <div onClick={showGlobal} className="pl-2">
        Back
      </div>
      <SidebarElement entry={local} />
    </div>
  )
}
