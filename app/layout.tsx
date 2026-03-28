import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MoodTunes',
  description: 'Premium music streaming experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} font-sans bg-[#0d1117] text-[#e6edf3] h-full overflow-hidden flex flex-col selection:bg-amber-500/30`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
