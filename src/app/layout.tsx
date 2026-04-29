import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IA Academy — Intelligence Artificielle Training Platform",
  description:
    "Formation IA Machine Learning — Apprenez le Machine Learning par la pratique avec des cours interactifs, des TPs concrets et des projets réels.",
  keywords: [
    "Machine Learning",
    "ML",
    "Deep Learning",
    "Formation",
    "TPs",
    "Python",
    "Scikit-learn",
    "TensorFlow",
    "Keras",
    "Formation IA",
    "Machine Learning",
  ],
  authors: [{ name: "MAALOUF Imad & AJEBLI Ahmed" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
