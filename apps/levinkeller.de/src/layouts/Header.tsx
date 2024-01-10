import React, { useMemo } from 'react'
import { Header as HeaderComponent } from '@shipyard/base/components/Header'
import { NavigationMenuLink } from '@shipyard/ui/components/ui/navigation-menu'
import { cn } from '@shipyard/ui/lib/utils'
const createGardenContent = (locale: string) => () => (
  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
    <ListItem title="Beetplaner" href={`/garden/${locale}/beds/1`} />
    <ListItem
      title="Aussaatkalender"
      href={`/garden/${locale}/sowing-calendar`}
    />
    <ListItem title="Einkaufsliste" href={`/garden/${locale}/shopping-list`} />
    <ListItem title="Pflanzen" href={`/garden/${locale}/plants/1`} />
  </ul>
)

export const Header = ({ locale, path }: { locale: string; path: string }) => {
  const links = useMemo(
    () =>
      [
        {
          label: 'Work',
          href: `/${locale}/work`,
        },
        { href: `/docs/${locale}`, label: 'Docs' },
        { href: `/blog/${locale}`, label: 'Blog' },
        {
          href: `/garden/${locale}/plants/1`,
          label: 'Gartenplaner',
          Content: createGardenContent(locale),
        },
        { href: `/${locale}/about`, label: 'About' },
      ].map((link) => ({
        ...link,
        active: link.href === path,
      })),
    [locale],
  )

  return (
    <HeaderComponent
      brand={{ name: 'Levin Keller', href: `/${locale}` }}
      links={links}
    />
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
