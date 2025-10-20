// src/styles/GlobalStyle.ts
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: linear-gradient(135deg, #0b1020, #111827);
    color: ${({ theme }) => theme.colors.fg};
    font-family: ui-sans-serif,system-ui,-apple-system;
  }

  /* code block look */
  code{
    background: ${({ theme }) => theme.colors.btnBg};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 2px 6px;
    border-radius: 6px;
  }
`;
