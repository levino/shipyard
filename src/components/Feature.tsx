import React from 'react'
import Link from '@docusaurus/Link'
interface Props {
  title: string
  description: string
  href: string
}

export const Feature: React.FC<Props> = ({ title, description, href }) => (
  <div className="card">
    <div className="card__header">
      <h5>{title}</h5>
    </div>
    <div className="card__body">
      <p>{description}</p>
    </div>
    <div className="card__footer button">
      <Link to={href}>
        <button className="button button--primary">Besuchen</button>
      </Link>
    </div>
  </div>
)
