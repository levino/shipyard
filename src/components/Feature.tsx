import React from 'react'
import Link from '@docusaurus/Link'
interface Props {
  title: string
  description: string
  href: string
}

export const Feature: React.FC<Props> = ({ title, description, href }) => (
  <Link
    to={href}
    className="max-w-sm bg-blue-50 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text--no-decoration hover:shadow-lg"
  >
    <div className="p-5">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {title}
      </h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {description}
      </p>
    </div>
  </Link>
)
