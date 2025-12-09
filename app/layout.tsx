import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import VSCodeLayout from "./components/layout/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IDE-e",
  description: "vs code 스타일의 웹 IDE 입니다.",
  icons: {
    icon: "/logo48.png",
  },
  openGraph: {
    title: "IDE-e",
    description: "vs code 스타일의 웹 IDE 입니다.",
    url: "https://ide-e.vercel.app",
    siteName: "IDE-e",
    images: [
      {
        url: "https://ide-e.vercel.app/sumnail.png",

        width: 1200,
        height: 630,
        alt: "IDE-e 대표 이미지",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <VSCodeLayout>{children}</VSCodeLayout>
      </body>
    </html>
  );
}
