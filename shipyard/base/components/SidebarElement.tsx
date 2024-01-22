export type Entry = Record<
  string,
  {
    label?: string
    href?: string
    subEntry?: Entry
    active?: boolean
  }
>

export const SidebarElement = ({ entry }: { entry: Entry }) =>
  Object.entries(entry).map(([key, entry]) => {
    const label = entry.label ?? key
    return (
      <li key={key}>
        {entry.href ? (
          <a href={entry.href}>{label}</a>
        ) : (
          <span className="menu-title">{label}</span>
        )}
        {entry.subEntry && (
          <ul>
            <SidebarElement entry={entry.subEntry} key={key} />
          </ul>
        )}
      </li>
    )
  })
