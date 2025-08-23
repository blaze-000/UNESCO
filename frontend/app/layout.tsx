import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
<<<<<<< HEAD
=======
import Header from "@/components/header"
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "UNESCO Youth Hackathon 2025 - Youth Leading the Way",
  description: "Building MIL Solutions for Impact - Online Learning Platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
<<<<<<< HEAD
      <body>{children}</body>
=======
      <body>
        <Header />
        {children}</body>
>>>>>>> 4b6ac2c21804f83c38330b231a65eaaa3a72f933
    </html>
  )
}
