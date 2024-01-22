import type { Config } from '@/schemas/config'

export const GlobalDesktopNavigation: React.FC<
  Pick<Config, 'brand' | 'navigation'>
> = ({ brand, navigation }) => (
  <div className="navbar bg-base-100">
    <span
      className="tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]"
      data-tip="Menu"
    >
      <label
        aria-label="Open menu"
        htmlFor="drawer"
        className="btn btn-square btn-ghost drawer-button lg:hidden "
      >
        <svg
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block h-5 w-5 stroke-current md:h-6 md:w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </label>
    </span>
    <div className="flex-1">
      <a href="/" className="btn btn-ghost text-xl">
        {brand}
      </a>
    </div>
    <div className="flex-none">
      <ul className="menu menu-horizontal px-1">
        {Object.entries(navigation).map(([key, entry]) =>
          entry.subEntry ? (
            <li key={key}>
              <details>
                <summary>{entry.label ?? key}</summary>
                <ul className="rounded-t-none bg-base-100 p-2">
                  {Object.entries(entry.subEntry).map(([key, entry]) => (
                    <li key={key}>
                      <a href={entry.href}>{entry.label ?? key}</a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ) : (
            <li key={key}>
              <a href={entry.href}>{entry.label ?? key}</a>
            </li>
          ),
        )}
      </ul>
    </div>
  </div>
)
