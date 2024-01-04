import React, { type FC } from 'react'
import { Footer as FBFooter } from 'flowbite-react'
export const Footer: FC<{
  links: {
    label: string
    href: string
  }[]
  copyright: {
    label: string
    href: string
    year: number
  }
}> = ({ links, copyright }) => (
  <FBFooter container>
    <FBFooter.Copyright
      href={copyright.href}
      by={copyright.label}
      year={copyright.year}
    />
    <FBFooter.LinkGroup>
      {links.map((link, key) => (
        <FBFooter.Link href={link.href} key={key}>
          {link.label}
        </FBFooter.Link>
      ))}
    </FBFooter.LinkGroup>
  </FBFooter>
)
