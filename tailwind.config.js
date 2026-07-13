/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // === COLORES PRINCIPALES — modifica aquí para cambiar el esquema ===
        electric: {
          DEFAULT: '#0066FF',   // Azul eléctrico principal
          light: 'rgb(49, 104, 186)',
          dark: '#0047CC',
          glow: '#0066FF33',
        },
        accent: {
          DEFAULT: '#FF6B00',   // Naranja brillante de acento
          light: '#FF8C33',
          dark: '#CC5500',
        },
        surface: {
          DEFAULT: '#0A0E1A',   // Fondo oscuro principal
          card: '#0F1528',      // Fondo de tarjetas
          border: '#1A2240',    // Bordes
          muted: '#1E2A4A',     // Superficies secundarias
        },
        text: {
          primary: '#F0F4FF',
          secondary: '#8899CC',
          muted: '#4A5A80',
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px #0066FF33' },
          '50%': { boxShadow: '0 0 60px #0066FF66, 0 0 120px #0066FF22' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px)',
        'hero-radial': 'radial-gradient(ellipse 80% 60% at 70% 50%, rgba(0,102,255,0.12) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(0,102,255,0.08) 0%, rgba(15,21,40,0) 100%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
