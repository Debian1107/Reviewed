// tailwind.config.js

module.exports = {
  // ... other configurations
  theme: {
    extend: {
      // 1. COLORS
      colors: {
        // Primary Brand Colors (Deep, Professional, and Vibrant Accent)
        "primary-dark": "#0f172a", // Slate-900 for backgrounds/text
        "primary-light": "#f8fafc", // Slate-50 for backgrounds/text
        accent: "#059669", // Emerald-600 for buttons/highlights
        "accent-light": "#a7f3d0", // Emerald-200 for subtle backgrounds

        // Secondary/Neutral Colors (for borders, placeholders, secondary text)
        "neutral-dark": "#334155", // Slate-700
        "neutral-medium": "#64748b", // Slate-500
        "neutral-light": "#e2e8f0", // Slate-200

        // Semantic/Feedback Colors (For login/signup forms, etc.)
        success: "#10b981", // Green-500
        error: "#ef4444", // Red-500
        warning: "#f59e0b", // Amber-500
      },

      // 2. TYPOGRAPHY
      fontFamily: {
        // Use a modern, highly readable font family
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        // Optional: A serif font for titles if you want a classic touch
        // serif: ['Georgia', 'serif'],
      },

      // 3. SHADOWS (To give components depth and professionalism)
      boxShadow: {
        "card-sm":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.08)",
        "card-md":
          "0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "accent-glow": "0 0 25px rgba(5, 150, 105, 0.3)", // Emerald glow for CTAs
        "inner-light": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)", // For inputs
      },

      // 4. BORDER RADIUS (For softer, modern edges)
      borderRadius: {
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px (used on your login/signup cards)
      },

      // 5. ANIMATION (For subtle hovers/interactions)
      transitionDuration: {
        400: "400ms",
      },
    },
  },
  // ... other configurations
};
