import React from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

interface HeaderProps {
  brand: {
    name: string
    href: string
  }
  links: {
    href: string
    label: string
    active: boolean
  }[]
}

export const Header: React.FC<HeaderProps> = ({ brand, links }) => (
  <div className="sticky top-0 z-50 bg-background/95">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href={brand.href}
            className={cn(
              'text-xl font-semibold',
              navigationMenuTriggerStyle(),
            )}
          >
            {brand.name}
          </NavigationMenuLink>
        </NavigationMenuItem>
        {links.map(({ active, label, href }, index) => (
          <NavigationMenuItem key={index}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
              active={active}
            >
              <a href={href}>{label}</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)
