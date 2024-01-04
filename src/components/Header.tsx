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
    active: boolean
  }[]
}

export const Header: React.FC<HeaderProps> = ({ brand, links }) => (
  <Navbar fluid rounded>
    <Navbar.Brand href={brand.href}>
      <span className="text-xl font-semibold">{brand.name}</span>
    </Navbar.Brand>
    <Navbar.Toggle />
    <Navbar.Collapse>
      {links.map(({ active, label, href }, index) => (
        <Navbar.Link key={index} href={href} active={active}>
          {label}
        </Navbar.Link>
      ))}
    </Navbar.Collapse>
  </Navbar>
)
