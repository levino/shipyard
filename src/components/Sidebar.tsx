import React from 'react'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { NavigationMenuSub } from '@radix-ui/react-navigation-menu'
import { cn } from '@/lib/utils'
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
          <NavigationMenuItem key={key}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href={entry.href}>{label}</a>
            </NavigationMenuLink>
            <NavigationMenuSub orientation="vertical">
              <NavigationMenuList className="flex-col items-start pl-4">
                <SidebarElement entry={entry.subEntry} key={key} />
              </NavigationMenuList>
            </NavigationMenuSub>
          </NavigationMenuItem>
        )
      }
      return (
        <NavigationMenuItem key={key}>
          <NavigationMenuLink
            className={cn(navigationMenuTriggerStyle(), 'hover:bg-transparent')}
          >
            {label}
          </NavigationMenuLink>
          <NavigationMenuSub orientation="vertical">
            <NavigationMenuList className="flex-col items-start pl-4">
              <SidebarElement entry={entry.subEntry} key={key} />
            </NavigationMenuList>
          </NavigationMenuSub>
        </NavigationMenuItem>
      )
    }
    if (!entry.href) {
      console.warn('No subentry and no href for entry', entry)
      return <div key={key}>{label}</div>
    }
    return (
      <NavigationMenuItem key={key}>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <a href={entry.href}>{label}</a>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  })

export const Sidebar: React.FC<SidebarProps> = ({ entry }) => (
  <NavigationMenu orientation="vertical">
    <NavigationMenuList className="flex-col items-start">
      <SidebarElement entry={entry} />
    </NavigationMenuList>
  </NavigationMenu>
)
