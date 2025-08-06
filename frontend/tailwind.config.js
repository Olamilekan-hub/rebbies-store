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
        // Primary Purple Palette
        'rebbie-purple': {
          50: '#F3E8FF',    // Lightest purple for backgrounds
          100: '#E9D5FF',   // Very light purple
          200: '#D8B4FE',   // Light purple
          300: '#C084FC',   // Accent purple
          400: '#A78BFA',   // Light primary
          500: '#8B5CF6',   // Medium purple
          600: '#7C3AED',   // Primary purple (main brand color)
          700: '#6D28D9',   // Dark purple
          800: '#5B21B6',   // Very dark purple
          900: '#4C1D95',   // Darkest purple
        },
        
        // Core Colors
        'rebbie-black': '#000000',
        'rebbie-white': '#FFFFFF',
        
        // Extended Gray Palette
        'rebbie-gray': {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        
        // Status Colors
        'rebbie-success': '#10B981',
        'rebbie-error': '#EF4444',
        'rebbie-warning': '#F59E0B',
        'rebbie-info': '#3B82F6',
      },
      
      // Custom Gradients
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #C084FC 0%, #A78BFA 100%)',
        'gradient-hero': 'linear-gradient(135deg, #000000 0%, #7C3AED 50%, #5B21B6 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)',
      },
      
      // Typography
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'heading': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1' }],           // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
      },
      
      // Custom Shadows
      boxShadow: {
        'purple-sm': '0 1px 2px 0 rgb(124 58 237 / 0.05)',
        'purple-md': '0 4px 6px -1px rgb(124 58 237 / 0.1), 0 2px 4px -2px rgb(124 58 237 / 0.1)',
        'purple-lg': '0 10px 15px -3px rgb(124 58 237 / 0.1), 0 4px 6px -4px rgb(124 58 237 / 0.1)',
        'purple-xl': '0 20px 25px -5px rgb(124 58 237 / 0.1), 0 8px 10px -6px rgb(124 58 237 / 0.1)',
        'purple-glow': '0 0 20px rgb(124 58 237 / 0.3)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
      },
      
      // Animation & Transitions
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      
      // Spacing
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      
      // Border Radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      
      // Screen Breakpoints (Mobile-First)
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      
      // Custom Widths for Nigerian Mobile Optimization
      maxWidth: {
        'mobile': '390px',    // iPhone 14 Pro Max
        'tablet': '768px',    // Standard tablet
        'desktop': '1200px',  // Desktop container
      },
      
      // Z-Index Scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
    },
  },
  plugins: [
    // Custom Nigerian-focused utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Touch-friendly button sizing
        '.btn-touch': {
          minHeight: '44px',
          minWidth: '44px',
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
        },
        '.btn-touch-lg': {
          minHeight: '48px',
          minWidth: '48px',
          padding: `${theme('spacing.4')} ${theme('spacing.8')}`,
        },
        
        // Nigerian currency formatting
        '.price-ngn': {
          '&::before': {
            content: '"₦"',
            fontWeight: '600',
          },
        },
        
        // WhatsApp green for messaging
        '.whatsapp-green': {
          backgroundColor: '#25D366',
          color: 'white',
        },
        
        // Smooth scroll for mobile
        '.scroll-smooth-mobile': {
          scrollBehavior: 'smooth',
          '-webkit-overflow-scrolling': 'touch',
        },
        
        // Text truncation utilities
        '.text-truncate-2': {
          display: '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.text-truncate-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
      }
      
      addUtilities(newUtilities)
    },
  ],
}