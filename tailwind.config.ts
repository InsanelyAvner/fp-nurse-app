import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        progress: {
          "0%": { transform: "translateX(-100%) scaleX(0.2)" },
          "20%": { transform: "translateX(-80%) scaleX(0.5)" },
          "40%": { transform: "translateX(-60%) scaleX(0.7)" },
          "60%": { transform: "translateX(-40%) scaleX(0.6)" },
          "80%": { transform: "translateX(-20%) scaleX(0.4)" },
          "100%": { transform: "translateX(0%) scaleX(0.2)" },
        },
        // This animation shows a disjointed section that looks like a dot on the second turn after 1 iteration of indeterminate-short in indeterminateProgress
        // I am too tired to care about this for now
        indeterminate: {
          '0%': { left: '-35%', right: '100%' },
          '60%': { left: '100%', right: '-90%' },
          '100%': { left: '100%', right: '-90%' }
        },
        'indeterminate-short': {
          '0%': { left: '-200%', right: '100%', opacity: '0' },
          '10%': { left: '-150%', right: '100%', opacity: '1' },
          '60%': { left: '107%', right: '-8%' },
          '100%': { left: '107%', right: '-8%' }
        }
      },
      animation: {
        progress: "progress 1.5s ease-in-out infinite",
        indeterminate: 'indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite',
        'indeterminate-short': 'indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite 1.15s'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;