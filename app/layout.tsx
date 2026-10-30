import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taste",
  description:
    "Cultural intelligence that finds the overlap between what people like and what businesses can build.",
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
