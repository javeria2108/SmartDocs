import { Syne, Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';
import { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { 
          colorPrimary: '#3371FF',
          fontSize: '16px',
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
      <GoogleAnalytics />
        <body
          className={cn(
            'min-h-screen font-sans antialiased',
            fontSans.variable,
            fontHeading.variable,
            fontBody.variable
          )}
        >
          <Provider>
            {children}
          </Provider>
        </body>
        
      </html>
    </ClerkProvider>
  );
}
