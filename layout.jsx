import './globals.css'
// import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const Metadata= {
  title: 'Calender App',
  description: 'calender app developed by seunfola',
}

export default function RootLayout({
  children, // will be a page or nested layout
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}