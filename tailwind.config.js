const fs = require('fs');
const path = require('path');

const themeTokensSource = fs.readFileSync(
  path.join(__dirname, 'constants/theme.ts'),
  'utf8',
);

function readThemeColor(tokenName, fallback) {
  const matcher = new RegExp(
    `export const ${tokenName} = ['\\\"]([^'\\\"]+)['\\\"];`,
  );
  const matched = themeTokensSource.match(matcher);
  return matched?.[1] ?? fallback;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: readThemeColor('PRIMARY_BG_COLOR', '#fff7ed'),
          100: '#ffedd5',
          500: readThemeColor('BRAND_COLOR', '#f97316'),
          600: '#ea580c',
        },
        border: readThemeColor('BORDER_COLOR', '#e4e4e7'),
        text: {
          main: readThemeColor('TEXT_MAIN_COLOR', '#18181b'),
          secondary: readThemeColor('TEXT_SECONDARY_COLOR', '#71717a'),
          inverse: readThemeColor('TEXT_INVERSE_COLOR', '#ffffff'),
        },
        surface: readThemeColor('SURFACE_COLOR', '#ffffff'),
        background: readThemeColor('BACKGROUND_COLOR', '#fafafa'),
      },
    },
  },
  plugins: [],
};
