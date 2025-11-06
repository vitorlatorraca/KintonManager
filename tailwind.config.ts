import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "16px",
        "2xl": "20px",
      },
      colors: {
        bg: {
          DEFAULT: "#0b0f14",
          soft: "#0f141a",
        },
        card: {
          DEFAULT: "#0f141a",
          hover: "#121a22",
          foreground: "var(--card-foreground)",
        },
        border: "#1e2936",
        line: "#1b2531",
        text: {
          primary: "#e6edf3",
          muted: "#9AA7B2",
          dim: "#7c8b97",
        },
        accent: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          foreground: "#ffffff",
        },
        info: "#22d3ee",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        bar: {
          groceries: "#22d3ee",
          transport: "#60a5fa",
          rent: "#a78bfa",
          subs: "#f472b6",
          savings: "#34d399",
        },
        // Mantendo compatibilidade com shadcn/ui
        background: "var(--background)",
        foreground: "var(--foreground)",
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.02), 0 8px 30px rgba(0,0,0,0.35)",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Text", "system-ui", "sans-serif"],
      },
      spacing: {
        13: "3.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
