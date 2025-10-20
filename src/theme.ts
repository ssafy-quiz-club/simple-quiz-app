// src/theme.ts
export const theme = {
  colors: {
    bg: "#0f172a",
    fg: "#e5e7eb",
    muted: "#94a3b8",
    card: "#111827",
    accent: "#22c55e",
    danger: "#ef4444",
    border: "#334155",
    navbg: "#0b1222",
    primary: "#1d4ed8",
    primaryBorder: "#1e40af",
    correctBorder: "#14532d",
    correctBg: "#0b2d19",
    wrongBorder: "#7f1d1d",
    wrongBg: "#2a0f0f",
    btnBg: "#0b1222",
    progressTrack: "#0b1222",
    progressBarStart: "#2563eb",
    progressBarEnd: "#22c55e",
  },
  sizes: {
    m: "16px",
    s: "12px",
    title: "22px",
    q: "18px",
  },
  layout: {
    maxWidth: "860px",
    maxWidthSm: "720px",
    radius: "16px",
    radiusSm: "12px",
  },
  z: {
    nav: 20,
  },
  bp: {
    sm: "980px",
  },
} as const;

export type AppTheme = typeof theme;
