import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zauq — AI-Guided Fashion Discovery Feed',
  description:
    'A login-free, single-session fashion discovery feed that narrows in real time through natural language refinements and tactile taste curation.',
  keywords: [
    'fashion discovery',
    'AI stylist',
    'outfit discovery',
    'minimalist fashion',
    'Zauq',
    'single session fashion',
  ],
  authors: [{ name: 'Zauq Studio' }],
  openGraph: {
    title: 'Zauq — AI Fashion Discovery Feed',
    description:
      'Curate your personal aesthetic in seconds. Natural language narrowing without account barriers.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Zauq',
  },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased bg-[#FAF7F2] text-[#1A1615]">
        {children}
      </body>
    </html>
  );
}
