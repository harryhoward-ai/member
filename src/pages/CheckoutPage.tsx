import { useMemo, useState } from 'react'
import type { ComponentProps } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from '@paypal/react-paypal-js'
import { getPricingPlanById, pricingPlans } from '@/pricingPlans'
import { loadAuthSession } from '@/authSession'

type PayPalButtonCreateOrder = NonNullable<ComponentProps<typeof PayPalButtons>['createOrder']>
type PayPalButtonOnApprove = NonNullable<ComponentProps<typeof PayPalButtons>['onApprove']>
type PayPalButtonOnError = NonNullable<ComponentProps<typeof PayPalButtons>['onError']>

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Checkout could not be completed. Please try again.'
}

function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [checkoutError, setCheckoutError] = useState('')
  const memberSession = loadAuthSession()
  const selectedPlan = getPricingPlanById(searchParams.get('plan'))
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined

  const paypalOptions = useMemo<ReactPayPalScriptOptions | null>(() => {
    if (!paypalClientId || !selectedPlan || selectedPlan.id === 'free') {
      return null
    }

    return {
      clientId: paypalClientId,
      currency: 'USD',
      intent: 'capture',
      components: 'buttons',
    }
  }, [paypalClientId, selectedPlan])

  const createOrder: PayPalButtonCreateOrder = async (_data, actions) => {
    if (!selectedPlan) {
      throw new Error('No plan selected for checkout.')
    }

    return actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: `Howard AI ${selectedPlan.name} Plan`,
          amount: {
            currency_code: 'USD',
            value: selectedPlan.price.toFixed(2),
          },
          custom_id: selectedPlan.id,
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      },
    })
  }

  const onApprove: PayPalButtonOnApprove = async (_data, actions) => {
    const details = await actions.order?.capture()
    const payerName = details?.payer?.name?.given_name

    setCheckoutError('')
    setCheckoutMessage(
      payerName
        ? `Thank you, ${payerName}. Your ${selectedPlan?.name ?? 'selected'} membership is now active.`
        : `Thank you. Your ${selectedPlan?.name ?? 'selected'} membership is now active.`,
    )
  }

  const onError: PayPalButtonOnError = (error) => {
    setCheckoutMessage('')
    setCheckoutError(getErrorMessage(error))
  }

  if (!selectedPlan || selectedPlan.id === 'free') {
    return (
      <main className="checkout-shell">
        <section className="checkout-card">
          <span className="section-kicker">Checkout</span>
          <h1>Select a paid plan to continue.</h1>
          <p className="checkout-copy">
            Free access stays on the registration flow. Choose Starter, Founder, or Pro from the pricing page to open PayPal checkout.
          </p>
          <div className="hero-actions checkout-actions">
            <Link className="button button-primary" to="/pricing">
              Back to pricing
            </Link>
            <Link className="button button-secondary" to="/app/signup">
              Create free account
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="checkout-shell">
      <section className="checkout-layout">
        <div className="checkout-summary-card">
          <span className="hero-pill">PayPal Checkout</span>
          <h1>Complete your {selectedPlan.name} plan upgrade.</h1>
          <p className="checkout-copy">
            Start your Howard AI {selectedPlan.name} membership with a secure PayPal checkout.
          </p>

          <div className="checkout-plan-card">
            <div className="plan-heading-row">
              <h2>{selectedPlan.name}</h2>
              {selectedPlan.badge ? <span className="plan-badge">{selectedPlan.badge}</span> : null}
            </div>
            <p className="plan-description">{selectedPlan.description}</p>
            <p className="plan-price checkout-plan-price">
              <span>${selectedPlan.price}</span>
              /month
            </p>
          </div>

          <div className="checkout-meta-list">
            <div className="checkout-meta-item">
              <span>Checkout email</span>
              <strong>{memberSession?.username ?? 'Not signed in'}</strong>
            </div>
            <div className="checkout-meta-item">
              <span>Plan term</span>
              <strong>Monthly membership</strong>
            </div>
            <div className="checkout-meta-item">
              <span>Secure checkout</span>
              <strong>PayPal</strong>
            </div>
          </div>
        </div>

        <section className="checkout-card">
          <span className="section-kicker">Complete order</span>
          <h2>Review your plan and continue with PayPal.</h2>
          <p className="checkout-copy">
            Check your selected plan details, then complete your order below.
          </p>

          {checkoutMessage ? <p className="auth-notice auth-notice-success">{checkoutMessage}</p> : null}
          {checkoutError ? <p className="auth-notice auth-notice-error">{checkoutError}</p> : null}

          {!paypalClientId ? (
            <div className="checkout-placeholder">
              <p className="auth-notice auth-notice-info">
                Add `VITE_PAYPAL_CLIENT_ID` to your environment before using the PayPal checkout page.
              </p>
              <code className="checkout-code">VITE_PAYPAL_CLIENT_ID=your_paypal_client_id</code>
            </div>
          ) : paypalOptions ? (
            <div className="checkout-paypal-shell">
              <PayPalScriptProvider options={paypalOptions}>
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    shape: 'rect',
                    label: 'paypal',
                    color: 'gold',
                  }}
                  forceReRender={[selectedPlan.id, selectedPlan.price]}
                  createOrder={createOrder}
                  onApprove={onApprove}
                  onError={onError}
                />
              </PayPalScriptProvider>
            </div>
          ) : null}

          <div className="hero-actions checkout-actions">
            <Link className="button button-secondary" to="/pricing">
              Back to pricing
            </Link>
          </div>
        </section>
      </section>

      <section className="checkout-plans-strip">
        {pricingPlans.filter((plan) => plan.id !== 'free').map((plan) => (
          <Link
            key={plan.id}
            className={`checkout-plan-switch${plan.id === selectedPlan.id ? ' is-active' : ''}`}
            to={`/checkout?plan=${plan.id}`}
          >
            <span>{plan.name}</span>
            <strong>${plan.price}/mo</strong>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default CheckoutPage