import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import ChatBotWrapper from "@/components/ui/ChatBotWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FairSight AI | Ethical AI Scoring",
  description: "Evaluate AI models for fairness and ethical standards with our advanced analysis tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${robotoMono.variable} bg-gray-950 text-gray-100 antialiased`}
      >
        <AuthProvider>
          {children}
          <ChatBotWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
