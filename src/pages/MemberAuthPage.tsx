import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AccApi, { AccountType } from '@/Api'
import { saveAuthSession } from '@/authSession'

function getErrorMessage(error: unknown) {
  if (typeof error === 'string') {
    return error
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

type AuthShellProps = {
  kicker: string
  title: string
  description: string
  asideTitle: string
  asideCopy: string
  children: ReactNode
}

function AuthShell({
  kicker,
  title,
  description,
  asideTitle,
  asideCopy,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-shell">
      <section className="auth-layout">
        <div className="auth-intro">
          <span className="hero-pill">{kicker}</span>
          <h1>{title}</h1>
          <p className="auth-copy">{description}</p>
        </div>

        <section className="auth-card">{children}</section>

        <aside className="auth-aside">
          <span className="section-kicker">Howard AI Members</span>
          <h2>{asideTitle}</h2>
          <p className="auth-copy">{asideCopy}</p>
          <ul className="auth-bullet-list">
            <li>Use one email account to manage your founder workflow access.</li>
            <li>Email verification protects account recovery and reset flows.</li>
            <li>Password reset stays available if you lose access to the current password.</li>
          </ul>
        </aside>
      </section>
    </main>
  )
}

type AuthNoticeProps = {
  tone: 'success' | 'error' | 'info'
  message: string
}

function AuthNotice({ tone, message }: AuthNoticeProps) {
  return <p className={`auth-notice auth-notice-${tone}`}>{message}</p>
}

type AuthFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password'
  autoComplete?: string
  placeholder?: string
}

function AuthField({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
}: AuthFieldProps) {
  const fieldId = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <label className="auth-field" htmlFor={fieldId}>
      <span>{label}</span>
      <input
        id={fieldId}
        className="auth-input"
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}

export function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email || !password || !confirmPassword) {
      setError('Please complete every field.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError('')
    setInfo('')

    try {
      const account = await AccApi.create(email, password, AccountType.Email)

      try {
        await AccApi.requestSendEmail(account.account_id)
        setInfo('Account created. We sent a verification email to your inbox.')
      } catch (sendError) {
        setInfo(getErrorMessage(sendError))
      }

      navigate(
        `/app/verify-email?accountId=${encodeURIComponent(account.account_id)}&email=${encodeURIComponent(account.username)}`,
      )
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Create Member Account"
      title="Register your Howard AI member account."
      description="Create an email-based member account so founders can verify access, sign in, and recover passwords safely."
      asideTitle="Account setup for founder workflows"
      asideCopy="Start with email signup, verify your inbox, then sign in to access founder tools and member-only flows."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          placeholder="founder@startup.com"
        />
        <AuthField
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
        />
        <AuthField
          label="Confirm password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          autoComplete="new-password"
          placeholder="Repeat your password"
        />

        {error ? <AuthNotice tone="error" message={error} /> : null}
        {info ? <AuthNotice tone="info" message={info} /> : null}

        <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>

        <div className="auth-links-row">
          <Link to="/app/login">Already have an account? Sign in</Link>
          <Link to="/pricing">Back to pricing</Link>
        </div>
      </form>
    </AuthShell>
  )
}

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [accountId, setAccountId] = useState(searchParams.get('accountId') ?? '')
  const [email, setEmail] = useState(searchParams.get('email') ?? '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('Enter the verification code from your email.')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!accountId || !code) {
      setError('Account ID and verification code are required.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const account = await AccApi.verifyEmail(accountId, code)
      saveAuthSession(account)
      navigate('/pricing')
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    if (!accountId) {
      setError('Enter your account ID before requesting another verification email.')
      return
    }

    setIsResending(true)
    setError('')

    try {
      const message = await AccApi.requestSendEmail(accountId)
      setInfo(message || 'Verification email sent again.')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthShell
      kicker="Verify Email"
      title="Confirm your email before signing in."
      description="Use the verification code from your inbox to activate your member account."
      asideTitle="Verification keeps recovery flows secure"
      asideCopy="Once the email address is confirmed, login and password reset flows can reliably identify the founder account behind that inbox."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Account ID"
          value={accountId}
          onChange={setAccountId}
          autoComplete="off"
          placeholder="Paste your account ID"
        />
        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          placeholder="founder@startup.com"
        />
        <AuthField
          label="Verification code"
          value={code}
          onChange={setCode}
          autoComplete="one-time-code"
          placeholder="Enter the code from email"
        />

        {error ? <AuthNotice tone="error" message={error} /> : null}
        {info ? <AuthNotice tone="info" message={info} /> : null}

        <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Verifying...' : 'Verify email'}
        </button>
        <button
          className="button button-secondary auth-submit"
          type="button"
          disabled={isResending}
          onClick={handleResend}
        >
          {isResending ? 'Sending...' : 'Resend email'}
        </button>

        <div className="auth-links-row">
          <Link to="/app/login">Go to login</Link>
          <Link to="/app/signup">Create another account</Link>
        </div>
      </form>
    </AuthShell>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('username') ?? '')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email || !password) {
      setError('Enter your email and password.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const account = await AccApi.login(email, password, AccountType.Email)
      saveAuthSession(account)
      navigate('/pricing')
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Member Login"
      title="Sign in to your Howard AI member account."
      description="Use your verified email and password to continue into the founder member experience."
      asideTitle="One login for your founder account"
      asideCopy="Email login keeps access simple while still supporting verification and password recovery when founders switch devices."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          placeholder="founder@startup.com"
        />
        <AuthField
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
        />

        {error ? <AuthNotice tone="error" message={error} /> : null}

        <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>

        <div className="auth-links-row">
          <Link to="/app/forgot-password">Forgot password?</Link>
          <Link to="/app/signup">Create account</Link>
        </div>
      </form>
    </AuthShell>
  )
}

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email) {
      setError('Enter the email address tied to your member account.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const message = await AccApi.requestResetPassword(email)
      setInfo(message || 'Reset instructions sent. Continue to the reset page when you have the code.')
      navigate(`/app/reset-password?username=${encodeURIComponent(email)}`)
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Forgot Password"
      title="Request a password reset email."
      description="We will send a reset code so you can create a new password for your member account."
      asideTitle="Recovery without support tickets"
      asideCopy="A reset code lets founders recover access on their own while keeping the flow anchored to a verified email address."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          placeholder="founder@startup.com"
        />

        {error ? <AuthNotice tone="error" message={error} /> : null}
        {info ? <AuthNotice tone="info" message={info} /> : null}

        <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset code'}
        </button>

        <div className="auth-links-row">
          <Link to="/app/reset-password">Already have a code?</Link>
          <Link to="/app/login">Back to login</Link>
        </div>
      </form>
    </AuthShell>
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(searchParams.get('username') ?? '')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!email || !code || !password || !confirmPassword) {
      setError('Complete every field to reset the password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const message = await AccApi.resetPassword(email, code, password)
      setInfo(message || 'Password updated. You can now sign in with the new password.')
      navigate(`/app/login?username=${encodeURIComponent(email)}`)
    } catch (submitError) {
      setError(getErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Reset Password"
      title="Create a new password with your reset code."
      description="Enter the code from the reset email and set a new password for your Howard AI member account."
      asideTitle="Reset and return to founder work"
      asideCopy="Once the new password is accepted, founders can sign back in immediately without creating a new account."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          value={email}
          onChange={setEmail}
          type="email"
          autoComplete="email"
          placeholder="founder@startup.com"
        />
        <AuthField
          label="Reset code"
          value={code}
          onChange={setCode}
          autoComplete="one-time-code"
          placeholder="Enter the reset code"
        />
        <AuthField
          label="New password"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="new-password"
          placeholder="Create a new password"
        />
        <AuthField
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
          autoComplete="new-password"
          placeholder="Repeat the new password"
        />

        {error ? <AuthNotice tone="error" message={error} /> : null}
        {info ? <AuthNotice tone="success" message={info} /> : null}

        <button className="button button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting...' : 'Reset password'}
        </button>

        <div className="auth-links-row">
          <Link to="/app/forgot-password">Request another code</Link>
          <Link to="/app/login">Back to login</Link>
        </div>
      </form>
    </AuthShell>
  )
}
