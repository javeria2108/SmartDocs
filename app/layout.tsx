import { Syne, Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { Metadata } from 'next';


import Provider from './Provider';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

const fontBody = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'SmartDocs',
  description: 'Your go-to collaborative editor',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>

        <body
          className={cn(
            'min-h-screen font-sans antialiased',
            fontSans.variable,
            fontHeading.variable,
            fontBody.variable
          )}
        >

          <GoogleAnalytics />
          <Provider>
            {children}
          </Provider>
        </body>

      </html>

  );
}
