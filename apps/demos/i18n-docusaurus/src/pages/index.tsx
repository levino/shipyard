import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header
      style={{
        padding: '4rem 0',
        textAlign: 'center',
        backgroundColor: 'var(--ifm-color-primary)',
        color: 'white',
      }}
    >
      <div className="container">
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {siteConfig.title}
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          {siteConfig.tagline}
        </p>
        <div>
          <Link
            className="button button--secondary button--lg"
            to="/docs"
            style={{ marginRight: '1rem' }}
          >
            Get Started
          </Link>
          <Link className="button button--secondary button--lg" to="/blog">
            Read the Blog
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Growing community, one plant at a time."
    >
      <HomepageHeader />
      <main style={{ padding: '4rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            <div style={{ padding: '1rem' }}>
              <h3>🌱 Community Garden</h3>
              <p>
                Join our vibrant community of gardeners growing food,
                friendships, and a greener future together.
              </p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3>📚 Learn & Grow</h3>
              <p>
                Access comprehensive guides on vegetable growing, harvesting,
                and organic gardening practices.
              </p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3>🤝 Get Involved</h3>
              <p>
                From plot rentals to volunteer opportunities, there are many
                ways to be part of Metro Gardens.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
