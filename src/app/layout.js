import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata = {
  title: 'internhunt',
  description: 'free internship scouter',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en"> 
      <body className={poppins.className + " bg-neutral-900"}>{children}</body>
    </html>
  )
}
