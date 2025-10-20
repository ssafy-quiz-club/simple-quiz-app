// src/components/ui.tsx
import styled from "styled-components";

export const Container = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 20px auto;
  padding: 16px;

  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    max-width: ${({ theme }) => theme.layout.maxWidthSm};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.layout.radius};
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,.35);
`;

export const H1 = styled.h1`
  margin: 0 0 6px;
  font-size: ${({ theme }) => theme.sizes.title};
`;

export const Muted = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
`;

export const Row = styled.div<{ wrap?: boolean; justify?: string; gap?: number }>`
  display: flex;
  gap: ${({ gap }) => (gap ?? 10)}px;
  align-items: center;
  flex-wrap: ${({ wrap }) => (wrap ? "wrap" : "nowrap")};
  ${({ justify }) => (justify ? `justify-content: ${justify};` : "")}
`;

export const Pill = styled.span`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  padding: 6px 10px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12px;
`;

export const Button = styled.button<{ variant?: "primary" | "default"; disabled?: boolean }>`
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.layout.radiusSm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.btnBg};
  color: ${({ theme }) => theme.colors.fg};
  cursor: pointer;

  ${({ variant, theme }) =>
    variant === "primary"
      ? `
    background: ${theme.colors.primary};
    border-color: ${theme.colors.primaryBorder};
  `
      : ""}

  &:hover{ border-color: #475569; }
  &:disabled{ opacity: .5; cursor: not-allowed; }
`;

export const Footer = styled.div`
  display: flex; justify-content: space-between; margin-top: 12px;
`;

export const Progress = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.progressTrack};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0;
`;

export const Bar = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.progressBarStart},
    ${({ theme }) => theme.colors.progressBarEnd}
  );
`;
