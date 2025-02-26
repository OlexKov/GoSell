/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'adaptive-footer-icons': 'clamp(20px, 4.5vh, 40px)', 
        'adaptive-icons': 'clamp(24px, 3vh, 40px)', 
        'adaptive-text': 'clamp(14px, 2vh, 36px)',
        'adaptive-login-header-text': 'clamp(14px, 3.8vh, 100px)',
        'adaptive-button-main-page-text': 'clamp(50px, 10vh, 100px)',
        'adaptive-button-text': 'clamp(14px, 2.5vh, 36px)',
        'adaptive-1_9_text': 'clamp(14px, 1.9vh, 36px)',
        'adaptive-1_8_text': 'clamp(14px, 1.8vh, 36px)',
        'adaptive-1_7_text': 'clamp(14px, 1.7vh, 36px)',
        'adaptive-1_6-text': 'clamp(12px, 1.6vh, 36px)',
        'adaptive-1_5-text': 'clamp(10px, 1.5vh, 36px)',
        'adaptive-3_3-text': 'clamp(25px, 3.3vh, 36px)',
        'adaptive-3_35-text': 'clamp(25px, 3.35vh, 36px)',
        'adaptive-3_5-text': 'clamp(25px, 3.35vh, 36px)',
        'adaptive-4-text': 'clamp(25px, 4vh, 36px)',
        'adaptive-input-form-text': 'clamp(14px, 1.7vh, 36px)',
        'adaptive-card-price-text': 'clamp(14px, 2.1vh, 36px)',
        'adaptive-footer-text': 'clamp(14px, 2.1vh, 36px)',
        'adaptive-advert-page-price-text': 'clamp(14px, 2.3vh, 36px)',
        'adaptive-input-form-error-text': 'clamp(11px, 1.5vh, 36px)',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        unbounded: ['Unbounded', 'sans-serif'],
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}

