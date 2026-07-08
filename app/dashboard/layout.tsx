import { Instrument_Serif, Inter } from 'next/font/google'
import '../landing.css'
import './dashboard.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${inter.variable} ${instrument.variable}`}>{children}</div>
}
