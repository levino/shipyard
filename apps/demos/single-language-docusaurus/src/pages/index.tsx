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
      description="shipyard without internationalization"
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
              <h3>📝 Simple Setup</h3>
              <p>
                No complex internationalization configuration needed. Just
                create content and start building.
              </p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3>🔗 Clean URLs</h3>
              <p>
                Enjoy clean URLs like /blog/post-title without language prefixes
                cluttering your paths.
              </p>
            </div>
            <div style={{ padding: '1rem' }}>
              <h3>🚀 Fast Development</h3>
              <p>
                Focus on features and content instead of managing translations
                and language files.
              </p>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}
