import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "How Rich",
  description: "Track income, spending and savings.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
