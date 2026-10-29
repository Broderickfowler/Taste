import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TASTE//OS",
  description: "Qloo-powered cultural intelligence for business strategy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
