export type Entry = Record<
  string,
  {
    label?: string
    href?: string
    subEntry?: Entry
  }
>

export const SidebarElement = ({ entry }: { entry: Entry }) => (
  <div className="flex flex-col leading-8 text-slate-600">
    {Object.entries(entry).map(([key, entry]) => {
      const label = entry.label ?? key
      return (
        <div className="flex flex-col" key={key}>
          {'href' in entry ? (
            <a className="pl-2 hover:bg-accent" href={entry.href}>
              {label}
            </a>
          ) : (
            <span className="pl-2 text-slate-400">{label}</span>
          )}
          {entry.subEntry && (
            <div className="flex flex-col pl-3">
              <SidebarElement entry={entry.subEntry} key={key} />
            </div>
          )}
        </div>
      )
    })}
  </div>
)
