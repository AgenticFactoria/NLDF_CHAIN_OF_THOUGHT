import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agent Thinking Protocol - Real-time MQTT Display",
  description: "Real-time display of agent thinking protocol messages via MQTT. Monitor agent outputs, inputs, and processing in real-time.",
  keywords: ["agent", "AI", "MQTT", "real-time", "thinking protocol", "monitoring"],
  authors: [{ name: "Agent Monitoring System" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/agentic-factoria-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/agentic-factoria-logo.png" />
        <link rel="shortcut icon" href="/agentic-factoria-logo.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
