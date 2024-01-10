import { Sidebar } from 'flowbite-react'
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
  <div className="fixed right-0 h-full lg:h-auto lg:overflow-y-visible">
    <Sidebar className="w-128 sticky" aria-label="Auf dieser Seite">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {links.map((link, key) => (
            <Sidebar.Item key={key} href={`#${link.slug}`}>
              {link.text}
            </Sidebar.Item>
          ))}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  </div>
)
