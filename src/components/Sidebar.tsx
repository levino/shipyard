import React from 'react'
import { Sidebar as FBSidebar } from 'flowbite-react'
interface Entry {
  label: string
  href: string
}

interface EntryGroup {
  label: string
  entries: Entry[]
}

interface SidebarProps {
  entries: (Entry | EntryGroup)[]
}

const SidebarElement = ({ entry }: { entry: Entry | EntryGroup }) => {
  if ('entries' in entry) {
    return (
      <FBSidebar.Collapse key={entry.label} label={entry.label}>
        {entry.entries.map((subEntry, key) => (
          <SidebarElement entry={subEntry} key={key} />
        ))}
      </FBSidebar.Collapse>
    )
  }
  return (
    <FBSidebar.Item key={entry.label} href={entry.href}>
      {entry.label}
    </FBSidebar.Item>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ entries }) => (
  <div className="fixed h-full lg:h-auto lg:overflow-y-visible">
    <FBSidebar
      className="w-128 hidden md:flex"
      aria-label="Seitenmenü für Dokumentationsartikel"
    >
      <FBSidebar.Items>
        <FBSidebar.ItemGroup>
          {entries.map((entry, key) => (
            <SidebarElement entry={entry} key={key} />
          ))}
        </FBSidebar.ItemGroup>
      </FBSidebar.Items>
    </FBSidebar>
  </div>
)
