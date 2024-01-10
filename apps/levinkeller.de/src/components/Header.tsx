import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'
import type { LinkData } from '@/types'
interface HeaderProps {
  brand: {
    name: string
    href: string
  }
  links: LinkData[]
}

export const Header: React.FC<HeaderProps> = ({ brand, links }) => (
  <div className="sticky top-0 z-50 hidden bg-background/95 md:block">
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
        {links.map(({ Content, label, active, href }, index) =>
          Content ? (
            <NavigationMenuItem key={index}>
              <NavigationMenuTrigger>{label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>
                  <Content />
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={index}>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
                active={active}
              >
                <a href={href}>{label}</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ),
        )}
      </NavigationMenuList>
    </NavigationMenu>
  </div>
)
