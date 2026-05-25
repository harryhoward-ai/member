export type ComparisonValue = boolean | string

export type PricingFeature = {
  label: string
  value: ComparisonValue
}

export type PricingPlanId = 'free' | 'starter' | 'founder' | 'pro'

export type PricingPlan = {
  id: PricingPlanId
  name: string
  price: number
  description: string
  badge?: string
  ctaHref: string
  ctaLabel: string
  comparison: PricingFeature[]
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    description:
      'For founders exploring an idea and testing Howard AI workflows before they commit.',
    ctaHref: '/app/signup',
    ctaLabel: 'Start free',
    comparison: [
      { label: 'Idea validation reports', value: '2 per month' },
      { label: 'Business planning workspace', value: 'Starter templates' },
      { label: 'Pitch material generation', value: 'Preview mode' },
      { label: 'Launch workflow boards', value: '1 active workflow' },
      { label: 'AI content generation', value: '20 credits / month' },
      { label: 'Founder dashboard', value: true },
      { label: 'Weekly planning copilot', value: false },
      { label: 'Saved startup projects', value: '1 project' },
      { label: 'Team collaboration', value: false },
      { label: 'Priority support', value: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 19,
    description:
      'For solo founders shaping positioning, building assets, and preparing to launch.',
    ctaHref: '/checkout?plan=starter',
    ctaLabel: 'Choose Starter',
    comparison: [
      { label: 'Idea validation reports', value: '10 per month' },
      { label: 'Business planning workspace', value: 'Guided builder' },
      { label: 'Pitch material generation', value: '5 exports / month' },
      { label: 'Launch workflow boards', value: '3 active workflows' },
      { label: 'AI content generation', value: '250 credits / month' },
      { label: 'Founder dashboard', value: true },
      { label: 'Weekly planning copilot', value: 'Weekly planning prompts' },
      { label: 'Saved startup projects', value: '5 projects' },
      { label: 'Team collaboration', value: false },
      { label: 'Priority support', value: 'Email support' },
    ],
  },
  {
    id: 'founder',
    name: 'Founder',
    price: 39,
    description:
      'For one-person startups running validation, planning, launch, and operations in one place.',
    badge: 'Most Popular',
    ctaHref: '/checkout?plan=founder',
    ctaLabel: 'Choose Founder',
    comparison: [
      { label: 'Idea validation reports', value: 'Unlimited' },
      { label: 'Business planning workspace', value: 'Advanced builder + strategy prompts' },
      { label: 'Pitch material generation', value: 'Unlimited exports' },
      { label: 'Launch workflow boards', value: 'Unlimited workflows' },
      { label: 'AI content generation', value: '1,000 credits / month' },
      { label: 'Founder dashboard', value: true },
      { label: 'Weekly planning copilot', value: 'Automated weekly plans' },
      { label: 'Saved startup projects', value: 'Unlimited' },
      { label: 'Team collaboration', value: 'Shareable review links' },
      { label: 'Priority support', value: 'Priority support' },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    description:
      'For founders who want deeper execution systems, more capacity, and advanced operating support.',
    ctaHref: '/checkout?plan=pro',
    ctaLabel: 'Choose Pro',
    comparison: [
      { label: 'Idea validation reports', value: 'Unlimited + reusable frameworks' },
      { label: 'Business planning workspace', value: 'Advanced builder + custom frameworks' },
      { label: 'Pitch material generation', value: 'Unlimited + brand-ready exports' },
      { label: 'Launch workflow boards', value: 'Unlimited + automations' },
      { label: 'AI content generation', value: '2,500 credits / month' },
      { label: 'Founder dashboard', value: true },
      { label: 'Weekly planning copilot', value: 'Execution workspace + reviews' },
      { label: 'Saved startup projects', value: 'Unlimited' },
      { label: 'Team collaboration', value: 'Multi-seat collaboration' },
      { label: 'Priority support', value: 'Fast-track support' },
    ],
  },
]

export function getPricingPlanById(planId: string | null | undefined) {
  if (!planId) {
    return null
  }

  return pricingPlans.find((plan) => plan.id === planId) ?? null
}