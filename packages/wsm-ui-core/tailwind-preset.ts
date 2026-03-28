// packages/wsm-ui-core/tailwind-preset.ts
import type { Config } from 'tailwindcss';

const preset = {
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        glass: 'rgba(255, 255, 255, 0.05)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Courier', 'monospace'],
        sans: ['"Syne"', 'sans-serif'],
      }
    }
  },
  plugins: [],
} satisfies Config;

export default preset;
