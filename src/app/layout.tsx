import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, Syncopate } from "next/font/google"

import Footer from "@/components/global/footer"
import Header from "@/components/global/header"
import { LenisProvider } from "@/components/provider/lenis-provider"
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import { cn } from "@/lib/utils"

import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const syncopate = Syncopate({
  variable: "--font-syncopate",
  weight: "700",
})

export const metadata: Metadata = {
  title: "cellae",
  description: "Your corner of the internet.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        geistMono.variable,
        "font-sans",
        inter.variable,
        geistSans.variable,
        syncopate.variable
      )}
    >
      <body>
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
