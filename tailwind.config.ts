import type { Config } from "tailwindcss";

import {
  BRAND_COLOR,
  ON_PRIMARY_COLOR,
  SUCCESS_COLOR,
  DANGER_COLOR,
  ACCENT_COLOR,
  TEXT_MAIN_COLOR,
  TEXT_SECONDARY_COLOR,
  TEXT_INVERSE_COLOR,
  TEXT_DISABLED_COLOR,
  BACKGROUND_COLOR,
  SURFACE_COLOR,
  PRIMARY_BG_COLOR,
  BG_INPUT_COLOR,
  BG_HOVER_COLOR,
  BG_OVERLAY_COLOR,
  SECONDARY_BG_COLOR,
  BORDER_COLOR,
  CHART_COLOR_1,
  CHART_COLOR_2,
  CHART_COLOR_3,
  CHART_COLOR_4,
  SPACE_XS,
  SPACE_SM,
  SPACE_MD,
  SPACE_LG,
  SPACE_XL,
  RADIUS_SM,
  RADIUS_MD,
  RADIUS_LG,
  RADIUS_FULL,
} from "./constants/theme";

const config: Config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  // TODO: 这里没有解决，我想使用ES模块方式引入
  // eslint-disable-next-line
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── 语义色 ────────────────────────────────────
        brand: BRAND_COLOR,
        "on-brand": ON_PRIMARY_COLOR,
        success: SUCCESS_COLOR,
        danger: DANGER_COLOR,
        accent: ACCENT_COLOR,

        // ── 文字色 ────────────────────────────────────
        "text-main": TEXT_MAIN_COLOR,
        "text-secondary": TEXT_SECONDARY_COLOR,
        "text-inverse": TEXT_INVERSE_COLOR,
        "text-disabled": TEXT_DISABLED_COLOR,

        // ── 背景色 ────────────────────────────────────
        background: BACKGROUND_COLOR,
        surface: SURFACE_COLOR,
        "bg-primary": PRIMARY_BG_COLOR,
        "bg-input": BG_INPUT_COLOR,
        "bg-hover": BG_HOVER_COLOR,
        "bg-overlay": BG_OVERLAY_COLOR,
        "bg-secondary": SECONDARY_BG_COLOR,

        // ── 边框色 ────────────────────────────────────
        border: BORDER_COLOR,

        // ── 图表调色板 ────────────────────────────────
        chart: {
          1: CHART_COLOR_1,
          2: CHART_COLOR_2,
          3: CHART_COLOR_3,
          4: CHART_COLOR_4,
        },
      },

      // ── 间距规范 ──────────────────────────────────────
      spacing: {
        xs: `${SPACE_XS}px`,
        sm: `${SPACE_SM}px`,
        md: `${SPACE_MD}px`,
        lg: `${SPACE_LG}px`,
        xl: `${SPACE_XL}px`,
      },

      // ── 圆角规范 ──────────────────────────────────────
      borderRadius: {
        sm: `${RADIUS_SM}px`,
        md: `${RADIUS_MD}px`,
        lg: `${RADIUS_LG}px`,
        full: `${RADIUS_FULL}px`,
      },
    },
  },
  plugins: [],
};

export default config;
