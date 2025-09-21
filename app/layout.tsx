import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'CollabFlow - Build better, together',
  description: 'Tinder for creative projects. Discover and connect with collaborators through swipe-based matching.',
  keywords: ['collaboration', 'creative projects', 'matching', 'base', 'miniapp'],
  authors: [{ name: 'CollabFlow Team' }],
  openGraph: {
    title: 'CollabFlow - Build better, together',
    description: 'Tinder for creative projects. Discover and connect with collaborators through swipe-based matching.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CollabFlow - Build better, together',
    description: 'Tinder for creative projects. Discover and connect with collaborators through swipe-based matching.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-textPrimary">
        <Providers>
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
