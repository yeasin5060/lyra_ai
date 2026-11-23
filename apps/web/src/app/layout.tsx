import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LYRA AI | Personal Assistant",
  description: "Your personal intelligent multilingual AI assistant."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
