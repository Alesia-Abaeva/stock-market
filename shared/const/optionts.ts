import type { Condition, Frequency } from '../types/global'

// Sign-up form select options
export const INVESTMENT_GOALS = [
  { value: 'Growth', label: 'Growth' },
  { value: 'Income', label: 'Income' },
  { value: 'Balanced', label: 'Balanced' },
  { value: 'Conservative', label: 'Conservative' },
]

export const RISK_TOLERANCE_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
]

export const PREFERRED_INDUSTRIES = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Energy', label: 'Energy' },
  { value: 'Consumer Goods', label: 'Consumer Goods' },
]

export const ALERT_TYPE_OPTIONS = [
  { value: 'upper', label: 'Upper' },
  { value: 'lower', label: 'Lower' },
  { value: 'price', label: 'Price' },
]

export const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: 'greater', label: 'Greater than (>)' },
  { value: 'less', label: 'Less than (<)' },
  { value: 'equal', label: 'Equal to (=)' },
]

export const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Once per day' },
  { value: 'hourly', label: 'Once per hour' },
]
