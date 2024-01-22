interface Props {
  title: string
  description: string
  href: string
}

export const Card: React.FC<Props> = ({ title, href, description }) => (
  <div className="card shadow-xl">
    <div className="card-body">
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
      <div className="card-actions justify-end">
        <a className="btn btn-primary" href={href}>
          Mehr
        </a>
      </div>
    </div>
  </div>
)
