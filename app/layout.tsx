import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BUC Student Activities Admin",
    template: "%s | BUC Admin",
  },
  description:
    "BUC Student Activities Administration Portal",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return children;
}