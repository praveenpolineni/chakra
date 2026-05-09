// constants/theme.ts
// This file is your CHAKRA design system.
// All colors, fonts, and spacing live here.
// Never hardcode colors anywhere else — always use these.

export const colors = {
  // Backgrounds
  bone: '#F7F5F0',      // main background — warm off-white
  linen: '#EFECE4',     // subtle surface cards
  stone: '#D3D1C7',     // borders, dividers
  
  // Text
  night: '#1A1A18',     // headlines, primary text
  dusk: '#2C2C2A',      // strong UI text
  slate: '#5F5E5A',     // secondary text, hints
  mist: '#888780',      // placeholder text, very subtle

  // Accent — use sparingly
  sage: '#1D9E75',      // the only green — active states, completions

  // Buttons
  btnPrimary: '#1A1A18',
  btnPrimaryText: '#F7F5F0',
};

export const fonts = {
  // You'll load these from Google Fonts via expo-font
  serif: 'DMSerifDisplay_400Regular',   // headlines only
  sans: 'DMSans_400Regular',            // body text
  sansMedium: 'DMSans_500Medium',       // labels, buttons
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 999,
};