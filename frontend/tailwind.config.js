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
        // Primary Brand Colors (Rebbie's Purple Palette)
        'rebbie': {
          50: '#F8F4FF',    // Very light purple for backgrounds
          100: '#F0E6FF',   // Light purple for subtle sections
          200: '#E1CCFF',   // Soft purple for cards
          300: '#C8A6FF',   // Medium light purple
          400: '#A78BFA',   // Light primary (accessories)
          500: '#8B5CF6',   // Medium purple (secondary actions)
          600: '#7C3AED',   // Primary purple (main brand color)
          700: '#6D28D9',   // Dark purple (headers)
          800: '#5B21B6',   // Very dark purple (text)
          900: '#4C1D95',   // Darkest purple (emphasis)
          950: '#2E1065',   // Ultra dark for contrast
        },
        
        // Accent Colors (Inspired by luxury fashion)
        'accent': {
          gold: '#D4AF37',      // Luxury gold accents
          rose: '#E91E63',      // Rose gold for jewelry
          emerald: '#10B981',   // Success states
          coral: '#FF6B6B',     // Sale/discount tags
          navy: '#1E3A8A',      // Professional dark blue
        },
        
        // Enhanced Gray Palette (Professional)
        'neutral': {
          0: '#FFFFFF',       // Pure white
          50: '#FAFAFA',      // Off-white backgrounds
          100: '#F5F5F5',     // Light gray sections
          200: '#E5E5E5',     // Subtle borders
          300: '#D4D4D4',     // Medium borders
          400: '#A3A3A3',     // Placeholder text
          500: '#737373',     // Secondary text
          600: '#525252',     // Primary text
          700: '#404040',     // Dark text
          800: '#262626',     // Very dark text
          900: '#171717',     // Near black
          950: '#0A0A0A',     // Pure black alternative
        },
        
        // Status Colors (Nigerian-optimized)
        'status': {
          success: '#10B981',   // Emerald - payments, delivery
          warning: '#F59E0B',   // Amber - pending states
          error: '#EF4444',     // Red - errors, sold out
          info: '#3B82F6',      // Blue - notifications
          pending: '#8B5CF6',   // Purple - processing
        },
        
        // Nigerian Context Colors
        'nigeria': {
          green: '#008751',     // Nigerian flag green
          white: '#FFFFFF',     // Nigerian flag white
          naira: '#2D5A27',     // Naira note green
          lagos: '#1E40AF',     // Lagos blue
          whatsapp: '#25D366',  // WhatsApp green
        },
      },
      
      // Enhanced Typography
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        'heading': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'ui-monospace', 'monospace'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // Display sizes for landing page
        'display-sm': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '3rem', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '4rem', fontWeight: '700' }],
        'display-xl': ['4.5rem', { lineHeight: '5rem', fontWeight: '800' }],
      },
      
      // Enhanced Spacing (Touch-friendly)
      spacing: {
        '13': '3.25rem',    // 52px
        '15': '3.75rem',    // 60px
        '17': '4.25rem',    // 68px
        '18': '4.5rem',     // 72px
        '19': '4.75rem',    // 76px
        '21': '5.25rem',    // 84px
        '22': '5.5rem',     // 88px
        '26': '6.5rem',     // 104px
        '30': '7.5rem',     // 120px
        '34': '8.5rem',     // 136px
        '38': '9.5rem',     // 152px
        '42': '10.5rem',    // 168px
        '46': '11.5rem',    // 184px
        '50': '12.5rem',    // 200px
        '54': '13.5rem',    // 216px
        '58': '14.5rem',    // 232px
        '62': '15.5rem',    // 248px
        '66': '16.5rem',    // 264px
        '70': '17.5rem',    // 280px
        
        // Touch targets (Nigerian mobile-first)
        'touch-sm': '44px',   // Minimum touch target
        'touch-md': '48px',   // Comfortable touch target
        'touch-lg': '56px',   // Large touch target
      },
      
      // Professional Shadows
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        
        // Brand-specific shadows
        'rebbie-sm': '0 2px 8px 0 rgb(124 58 237 / 0.1)',
        'rebbie-md': '0 8px 25px -5px rgb(124 58 237 / 0.2)',
        'rebbie-lg': '0 25px 50px -12px rgb(124 58 237 / 0.25)',
        'rebbie-glow': '0 0 20px rgb(124 58 237 / 0.3)',
        
        // Interactive shadows
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        'button-hover': '0 8px 15px -5px rgb(124 58 237 / 0.3)',
        'product-hover': '0 20px 40px -10px rgb(0 0 0 / 0.15)',
      },
      
      // Border Radius (Modern)
      borderRadius: {
        'xs': '0.125rem',   // 2px
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.375rem', // 6px
        'md': '0.5rem',     // 8px
        'lg': '0.75rem',    // 12px
        'xl': '1rem',       // 16px
        '2xl': '1.5rem',    // 24px
        '3xl': '2rem',      // 32px
        '4xl': '2.5rem',    // 40px
        '5xl': '3rem',      // 48px
      },
      
      // Professional Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
        'gradient-accent': 'linear-gradient(135deg, #C8A6FF 0%, #A78BFA 100%)',
        'gradient-hero': 'linear-gradient(135deg, #000000 0%, #7C3AED 50%, #5B21B6 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #FAFAFA 100%)',
        'gradient-glass': 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        
        // Nigerian-inspired gradients
        'gradient-naira': 'linear-gradient(135deg, #008751 0%, #2D5A27 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        
        // Mesh gradients for modern look
        'mesh-purple': 'radial-gradient(circle at 25% 25%, #7C3AED 0%, transparent 50%), radial-gradient(circle at 75% 75%, #A78BFA 0%, transparent 50%)',
        'mesh-neutral': 'radial-gradient(circle at 25% 25%, #F5F5F5 0%, transparent 50%), radial-gradient(circle at 75% 75%, #E5E5E5 0%, transparent 50%)',
      },
      
      // Animation & Transitions
      animation: {
        // Entrance animations
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        
        // Loading animations
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        
        // Interactive animations
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        
        // Nigerian-specific
        'naira-bounce': 'nairaBounce 1s ease-in-out',
        'whatsapp-pulse': 'whatsappPulse 2s ease-in-out infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgb(124 58 237 / 0.3)' },
          '100%': { boxShadow: '0 0 30px rgb(124 58 237 / 0.6)' },
        },
        nairaBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        whatsappPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
      
      // Professional Transitions
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      
      // Responsive Breakpoints (Nigerian mobile-first)
      screens: {
        'xs': '375px',      // Small phones
        'sm': '640px',      // Large phones
        'md': '768px',      // Tablets
        'lg': '1024px',     // Small laptops
        'xl': '1280px',     // Large laptops
        '2xl': '1536px',    // Desktops
        '3xl': '1920px',    // Large desktops
        
        // Nigerian-specific breakpoints
        'mobile': '390px',   // iPhone 12 Pro Max
        'tablet': '768px',   // iPad
        'laptop': '1024px',  // MacBook Air
        'desktop': '1280px', // Standard desktop
      },
      
      // Z-Index Scale (Professional)
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
        'whatsapp': '1090',
      },
    },
  },
  plugins: [
    // Custom plugin for Nigerian-specific utilities
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        // Touch-friendly utilities
        '.touch-target': {
          minHeight: theme('spacing.touch-sm'),
          minWidth: theme('spacing.touch-sm'),
        },
        '.touch-target-lg': {
          minHeight: theme('spacing.touch-lg'),
          minWidth: theme('spacing.touch-lg'),
        },
        
        // Nigerian currency utilities
        '.price-naira::before': {
          content: '"₦"',
          fontWeight: '600',
          marginRight: '0.125rem',
        },
        '.price-dollar::before': {
          content: '"$"',
          fontWeight: '600',
          marginRight: '0.125rem',
        },
        
        // Text utilities
        '.text-balance': {
          textWrap: 'balance',
        },
        '.text-pretty': {
          textWrap: 'pretty',
        },
        
        // Scroll utilities
        '.scroll-smooth-mobile': {
          scrollBehavior: 'smooth',
          '-webkit-overflow-scrolling': 'touch',
        },
        
        // Glass morphism
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }

      const newComponents = {
        // Button components
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: '600',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          border: 'none',
          textDecoration: 'none',
          minHeight: theme('spacing.touch-sm'),
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          fontSize: theme('fontSize.sm[0]'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
        },
        '.btn-primary': {
          backgroundColor: theme('colors.rebbie.600'),
          color: theme('colors.white'),
          boxShadow: theme('boxShadow.rebbie-sm'),
          '&:hover': {
            backgroundColor: theme('colors.rebbie.700'),
            transform: 'translateY(-1px)',
            boxShadow: theme('boxShadow.rebbie-md'),
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.neutral.900'),
          color: theme('colors.white'),
          boxShadow: theme('boxShadow.sm'),
          '&:hover': {
            backgroundColor: theme('colors.neutral.800'),
            transform: 'translateY(-1px)',
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          color: theme('colors.rebbie.600'),
          border: `2px solid ${theme('colors.rebbie.600')}`,
          '&:hover': {
            backgroundColor: theme('colors.rebbie.600'),
            color: theme('colors.white'),
            transform: 'translateY(-1px)',
          },
        },
        '.btn-ghost': {
          backgroundColor: 'transparent',
          color: theme('colors.rebbie.600'),
          '&:hover': {
            backgroundColor: theme('colors.rebbie.50'),
          },
        },
        
        // Card components
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.xl'),
          boxShadow: theme('boxShadow.sm'),
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
        },
        '.card-hover': {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
        '.card-product': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.product-hover'),
          },
        },
      }

      addUtilities(newUtilities)
      addComponents(newComponents)
    },
  ],
}