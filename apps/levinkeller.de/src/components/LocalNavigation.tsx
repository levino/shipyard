import React from 'react'

import { SidebarElement } from './SidebarElement'
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

export const Sidebar: React.FC<SidebarProps> = ({ entry }) => (
  <SidebarElement entry={entry} />
)
