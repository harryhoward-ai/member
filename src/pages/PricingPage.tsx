import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AccountStatus, type DashFunAccount } from '@/Api'
import { clearAuthSession, loadAuthSession } from '@/authSession'
import { pricingPlans } from '@/pricingPlans'

const faqs = [
  {
    question: 'Who is Howard AI designed for?',
    answer:
      'Howard AI is built for solo founders and lean startup operators who need structured help across idea validation, business planning, launch preparation, content generation, and day-to-day execution.',
  },
  {
    question: 'What changes between Starter, Founder, and Pro?',
    answer:
      'Each paid plan expands workflow depth and execution capacity. Starter is best for early planning, Founder adds the full startup execution stack, and Pro is for founders who need more output capacity, automation, and operating support.',
  },
  {
    question: 'Can I begin on the Free plan and upgrade later?',
    answer:
      'Yes. You can start with Free to test the workspace, then upgrade when you need more reports, launch workflows, generated materials, or saved projects.',
  },
  {
    question: 'Does Howard AI replace a human team?',
    answer:
      'Howard AI is designed to help a solo founder operate with more structure and speed. It supports research, planning, content, launch, and operations workflows so one person can move more of the business forward inside one platform.',
  },
]

function formatFeatureValue(value: boolean | string) {
  if (typeof value === 'boolean') {
    return value ? 'Included' : 'Not included'
  }

  return value
}

function isAvailable(value: boolean | string) {
  return value !== false
}

function getComparisonRows(plans: typeof pricingPlans) {
  const labels = plans.flatMap((plan) => plan.comparison.map((feature) => feature.label))
  const uniqueLabels = Array.from(new Set(labels))

  return uniqueLabels.map((label) => ({
    label,
    values: plans.map((plan) => {
      const feature = plan.comparison.find((entry) => entry.label === label)

      return feature?.value ?? false
    }),
  }))
}

function getMemberStatusLabel(status: DashFunAccount['status']) {
  switch (status) {
    case AccountStatus.Unvalidated:
      return 'Email verification pending'
    case AccountStatus.Normal:
      return 'Member active'
    case AccountStatus.Frozen:
      return 'Account frozen'
    case AccountStatus.Deleted:
      return 'Account unavailable'
    default:
      return 'Unknown status'
  }
}

function PricingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0)
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false)
  const [memberSession, setMemberSession] = useState<DashFunAccount | null>(loadAuthSession())
  const comparisonRows = getComparisonRows(pricingPlans)
  const comparisonTableId = 'comparison-heading'

  function handleSignOut() {
    clearAuthSession()
    setMemberSession(null)
    setIsMemberMenuOpen(false)
  }

  return (
    <div className="pricing-page">
      <header className="pricing-topbar">
        <div className="member-menu-shell">
          <button
            type="button"
            className={`member-icon-button${memberSession ? ' is-active' : ''}`}
            aria-expanded={isMemberMenuOpen}
            aria-label={memberSession ? 'Open member menu' : 'Open sign in menu'}
            onClick={() => setIsMemberMenuOpen((isOpen) => !isOpen)}
          >
            <span className={`member-status-dot${memberSession ? ' is-active' : ''}`} aria-hidden="true"></span>
            <svg viewBox="0 0 24 24" className="member-icon" aria-hidden="true">
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-6 1.79-6 4v1h12v-1c0-2.21-2.67-4-6-4Z" />
            </svg>
          </button>

          {isMemberMenuOpen ? (
            <div className="member-menu-card">
              {memberSession ? (
                <>
                  <p className="member-menu-title">{memberSession.username}</p>
                  <p className="member-menu-copy">{getMemberStatusLabel(memberSession.status)}</p>
                  <button className="button button-secondary member-menu-action" type="button" onClick={handleSignOut}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <p className="member-menu-title">Member access</p>
                  <p className="member-menu-copy">Sign in or create an account to continue.</p>
                  <div className="member-menu-links">
                    <Link className="button button-primary member-menu-action" to="/app/login">
                      Sign in
                    </Link>
                    <Link className="button button-secondary member-menu-action" to="/app/signup">
                      Create account
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="hero-pill">Howard AI Pricing</span>
          <h1>Founder-first plans for building a one-person startup with an AI team.</h1>
          <p className="hero-lead">
            Validate ideas, shape your business plan, create pitch materials,
            launch faster, and keep day-to-day execution organized in one premium
            founder workspace.
          </p>
          <div className="hero-actions">
            {memberSession ? (
              <a className="button button-primary" href="#pricing-heading">
                View plans
              </a>
            ) : (
              <a className="button button-primary" href="/app/signup">
                Start with Free
              </a>
            )}
            <a className="button button-secondary" href="#compare">
              Compare plans
            </a>
          </div>
        </div>

        <div className="hero-panel" aria-label="Howard AI platform overview">
          <div className="hero-panel-grid">
            <div>
              <span className="metric-label">Built for</span>
              <strong>Solo founders</strong>
            </div>
            <div>
              <span className="metric-label">Core workflows</span>
              <strong>Validate, build, launch, operate</strong>
            </div>
            <div>
              <span className="metric-label">Platform model</span>
              <strong>AI startup execution workspace</strong>
            </div>
            <div>
              <span className="metric-label">Best fit</span>
              <strong>One-person startups moving from idea to launch</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="pricing-grid-section" aria-labelledby="pricing-heading">
        <div className="section-heading">
          <span className="section-kicker">Plans</span>
          <h2 id="pricing-heading">Choose the level of execution support you need.</h2>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => {
            const cardFeatures = plan.comparison
              .filter((feature) => isAvailable(feature.value))
              .slice(0, 5)

            return (
              <article
                key={plan.name}
                className={`pricing-card${plan.badge ? ' pricing-card-featured' : ''}`}
              >
                <div className="pricing-card-top">
                  <div>
                    <div className="plan-heading-row">
                      <h3>{plan.name}</h3>
                      {plan.badge ? <span className="plan-badge">{plan.badge}</span> : null}
                    </div>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <p className="plan-price">
                    <span>${plan.price}</span>
                    /month
                  </p>
                </div>

                <ul className="plan-feature-list">
                  {cardFeatures.map((feature) => (
                    <li key={`${plan.name}-${feature.label}`}>
                      <span className="feature-label">{feature.label}</span>
                      <span className="feature-value">{formatFeatureValue(feature.value)}</span>
                    </li>
                  ))}
                </ul>

                <a
                  className={`button ${plan.badge ? 'button-primary' : 'button-secondary'}`}
                  href={plan.ctaHref}
                >
                  {plan.ctaLabel}
                </a>
              </article>
            )
          })}
        </div>
      </section>

      <section id="compare" className="comparison-section" aria-labelledby="comparison-heading">
        <div className="section-heading">
          <span className="section-kicker">Comparison</span>
          <h2 id="comparison-heading">Everything included across the founder journey.</h2>
        </div>

        <div className="comparison-shell">
          <table className="comparison-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {pricingPlans.map((plan) => (
                  <th scope="col" key={`heading-${plan.name}`}>
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {row.values.map((value, index) => (
                    <td key={`${row.label}-${pricingPlans[index].name}`}>
                      {typeof value === 'boolean' ? (
                        <span className={`table-boolean${value ? ' is-yes' : ' is-no'}`}>
                          {value ? 'Included' : 'Not included'}
                        </span>
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="comparison-cards" aria-labelledby={comparisonTableId}>
          {pricingPlans.map((plan) => (
            <article
              key={`mobile-${plan.name}`}
              className={`comparison-card${plan.badge ? ' comparison-card-featured' : ''}`}
            >
              <div className="comparison-card-header">
                <div className="plan-heading-row">
                  <h3>{plan.name}</h3>
                  {plan.badge ? <span className="plan-badge">{plan.badge}</span> : null}
                </div>
                <p className="comparison-card-price">
                  <span>${plan.price}</span>
                  /month
                </p>
              </div>

              <dl className="comparison-card-list">
                {plan.comparison.map((feature) => (
                  <div key={`${plan.name}-comparison-${feature.label}`} className="comparison-card-item">
                    <dt>{feature.label}</dt>
                    <dd className={typeof feature.value === 'boolean' ? 'comparison-card-boolean' : ''}>
                      {formatFeatureValue(feature.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="faq-section" aria-labelledby="faq-heading">
        <div className="section-heading">
          <span className="section-kicker">FAQ</span>
          <h2 id="faq-heading">Questions founders usually ask before choosing a plan.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openFaqIndex === index

            return (
              <article key={item.question} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-trigger"
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen ? <p className="faq-answer">{item.answer}</p> : null}
              </article>
            )
          })}
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-heading">
        <div className="final-cta-card">
          <span className="section-kicker">Ready to build</span>
          <h2 id="final-cta-heading">Run your startup with one platform behind you.</h2>
          <p>
            Start on Free if you are exploring, or move into Founder when you want
            the full workflow for validation, planning, pitch prep, launch assets,
            and founder operations.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="/app/signup">
              Create free account
            </a>
            <a className="button button-secondary" href="/api/checkout?plan=founder">
              Choose Founder
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PricingPage