import type { Metadata } from 'next';
import { Outfit, DM_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/AppShell';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

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
      <body suppressHydrationWarning className={`${outfit.variable} ${dmSans.variable} ${jetbrains.variable} font-sans bg-[var(--bg)] text-[var(--t1)] h-full overflow-hidden flex flex-col selection:bg-[var(--acc-dim)]`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
