import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { ToastContainer } from '../components/ui/ToastContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YOUR TIME TRADE | 90-Day Personal Growth System',
  description: 'A structured system for continuous consistency across Spiritual, Social, and Mental growth pillars.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col pb-16 lg:pb-0`}>
        <Navbar />
        <ToastContainer />
        <main className="flex-1">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
