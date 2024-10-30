import React from 'react'

interface Link {
  depth: number
  text: string
  slug: string
}

interface TableOfContentsProps {
  links: Link[]
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ links }) => (
  <div className='fixed right-0 h-full lg:h-auto lg:overflow-y-visible'>
    <div className='w-128 sticky' aria-label='Auf dieser Seite'>
      {links.map((link, key) => (
        <a key={key} href={`#${link.slug}`}>
          {link.text}
        </a>
      ))}
    </div>
  </div>
)
