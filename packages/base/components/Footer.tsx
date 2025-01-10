import { type FC } from 'react'
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
  <footer className='flex w-full items-center justify-between px-6 py-4 text-sm font-medium'>
    <a href={copyright.href} target='_blank'>
      © {copyright.label}, {copyright.year}
    </a>
    {links.map(({ label, href }, index) => (
      <a key={index} href={href}>
        {label}
      </a>
    ))}
  </footer>
)
