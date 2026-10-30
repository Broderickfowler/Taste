import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taste",
  description:
    "The same hotel. Your version. Taste turns cultural preferences into personalized hotel experiences powered by Qloo.",
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
