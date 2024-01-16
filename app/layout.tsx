import type { Metadata } from 'next';
import './globals.css';
import Providers from './Providers';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: '빙터파크',
  description: '빙터파크',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-screen w-screen flex justify-center items-center">
        <Providers>
          <main className="max-w-xl w-full">{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
