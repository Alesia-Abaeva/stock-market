/* eslint-disable no-unused-vars */
import type {
  Control,
  FieldError,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form'

export type SignInFormData = {
  email: string
  password: string
}

export type SignUpFormData = {
  fullName: string
  email: string
  password: string
  country: string
  investmentGoals: string
  riskTolerance: string
  preferredIndustry: string
}

export type CountrySelectProps = {
  name: string
  label: string
  control: Control<any>
  error?: FieldError
  required?: boolean
}

export type FormInputProps<T extends FieldValues> = {
  name: string
  label: string
  placeholder: string
  type?: string
  register: UseFormRegister<T>
  error?: FieldError
  validation?: RegisterOptions
  disabled?: boolean
  value?: string
}

export type Option = {
  value: string
  label: string
}

export type SelectFieldProps = {
  name: string
  label: string
  placeholder: string
  options: readonly Option[]
  control: Control<any>
  error?: FieldError
  required?: boolean
}

export type FooterLinkProps = {
  text: string
  linkText: string
  href: string
}

export type TSearchCommandProps = {
  renderAs?: 'button' | 'text'
  label?: string
  initialStocks: StockWithWatchlistStatus[]
}

export type WelcomeEmailData = {
  email: string
  name: string
  intro: string
}

export type User = {
  id: string
  name: string
  email: string
}

export type Stock = {
  symbol: string
  name: string
  exchange: string
  type: string
}

export type StockWithWatchlistStatus = Stock & {
  isInWatchlist: boolean
}

export type FinnhubSearchResult = {
  symbol: string
  description: string
  displaySymbol?: string
  type: string
}

export type FinnhubSearchResponse = {
  count: number
  result: FinnhubSearchResult[]
}

export type StockDetailsPageProps = {
  params: Promise<{
    symbol: string
  }>
}

export type WatchlistButtonProps = {
  symbol: string
  company: string
  isInWatchlist: boolean
  showTrashIcon?: boolean
  type?: 'button' | 'icon'
  onWatchlistChange?: (symbol: string, isAdded: boolean) => void
}

export type QuoteData = {
  c?: number
  dp?: number
}

export type ProfileData = {
  name?: string
  marketCapitalization?: number
}

export type FinancialsData = {
  metric?: { [key: string]: number }
}

export type SelectedStock = {
  symbol: string
  company: string
  currentPrice?: number
}

export type WatchlistTableProps = {
  watchlist: StockWithData[]
}

export type StockWithData = {
  userId: string
  symbol: string
  company: string
  addedAt: Date
  currentPrice?: number
  changePercent?: number
  priceFormatted?: string
  changeFormatted?: string
  marketCap?: string
  peRatio?: string
}

export type AlertsListProps = {
  alertData: Alert[] | undefined
}

export type MarketNewsArticle = {
  id: number
  headline: string
  summary: string
  source: string
  url: string
  datetime: number
  category: string
  related: string
  image?: string
}

export type WatchlistNewsProps = {
  news?: MarketNewsArticle[]
}

export type SearchCommandProps = {
  open?: boolean
  setOpen?: (open: boolean) => void
  renderAs?: 'button' | 'text'
  buttonLabel?: string
  buttonVariant?: 'primary' | 'secondary'
  className?: string
}

export type AlertData = {
  symbol: string
  company: string
  alertName: string
  alertType: 'upper' | 'lower'
  threshold: string
}

export type AlertModalProps = {
  alertId?: string
  alertData?: AlertData
  action?: string
  open: boolean
  setOpen: (open: boolean) => void
}

export type RawNewsArticle = {
  id: number
  headline?: string
  summary?: string
  source?: string
  url?: string
  datetime?: number
  image?: string
  category?: string
  related?: string
}

export type Alert = {
  id: string
  symbol: string
  company: string
  alertName: string
  currentPrice: number
  alertType: 'upper' | 'lower'
  threshold: number
  changePercent?: number
}
