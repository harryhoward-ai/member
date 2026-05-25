import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="route-shell">
      <section className="route-card">
        <span className="hero-pill">404</span>
        <h1>That page is not part of the current Howard AI site map.</h1>
        <p className="route-copy">
          The pricing route is live. You can go back there or jump straight into the
          product signup flow.
        </p>
        <div className="hero-actions route-actions">
          <Link className="button button-primary" to="/pricing">
            Go to pricing
          </Link>
          <a className="button button-secondary" href="/app/signup">
            Create free account
          </a>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage