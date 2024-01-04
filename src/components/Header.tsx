import React from 'react'
import { Navbar } from 'flowbite-react'

interface HeaderProps {
  brand: {
    name: string
    href: string
  }
  links: {
    href: string
    label: string
  }[]
}

export const Header: React.FC<HeaderProps> = ({ brand, links }) => (
  <Navbar fluid rounded>
    <Navbar.Brand href={brand.href}>{brand.name}</Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
      {links.map((link, index) => (
        <Navbar.Link key={index} href={link.href}>
          {link.label}
        </Navbar.Link>
      ))}
    </Navbar.Collapse>
  </Navbar>
)
