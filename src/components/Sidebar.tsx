import React from 'react'
export type Entry = Record<
  string,
  {
    label?: string
    href?: string
    subEntry?: Entry
  }
>

interface SidebarProps {
  entry: Entry
}

const SidebarElement = ({ entry }: { entry: Entry }) =>
  Object.entries(entry).map(([key, entry]) => {
    const label = entry.label ?? key
    if (entry.subEntry) {
      if ('href' in entry) {
        return (
          <div key={key}>
            <a href={entry.href}>{label}</a>
            <div className="pl-4">
              <SidebarElement entry={entry.subEntry} key={key} />
            </div>
          </div>
        )
      }
      return (
        <div key={key}>
          {label}
          <div className="pl-4">
            <SidebarElement entry={entry.subEntry} key={key} />
          </div>
        </div>
      )
    }
    if (!entry.href) {
      console.warn('No subentry and no href for entry', entry)
      return <div key={key}>{label}</div>
    }
    return (
      <div key={key}>
        <a href={entry.href}>{label}</a>
      </div>
    )
  })

export const Sidebar: React.FC<SidebarProps> = ({ entry }) => (
  <div className="fixed h-full lg:h-auto lg:overflow-y-visible">
    <nav
      className="w-128 pl=-8 hidden flex-col bg-slate-200 py-4 pl-8 md:flex"
      aria-label="Seitenmenü für Dokumentationsartikel"
    >
      <SidebarElement entry={entry} />
    </nav>
  </div>
)
