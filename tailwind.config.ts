import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0f19',
        panel: '#121829',
        border: '#1e293b',
        accent: '#22d3ee',
        text: '#e2e8f0',
        muted: '#94a3b8'
      }
    },
  },
  plugins: [],
} satisfies Config
