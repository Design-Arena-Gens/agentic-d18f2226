import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Agentic Code Creator',
  description: 'Online code creator with multi-LLM integration and live preview',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-text antialiased">{children}</body>
    </html>
  )
}
