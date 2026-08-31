import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DigismartProvider } from '@/lib/digismartContext';

export const metadata: Metadata = {
  title: 'DIGISMART | AI Command Center - Komunikasi Publik Digital',
  description: 'Platform AI Public Communication untuk pemantauan isu, generator berita, analisis sentimen publik, respons krisis, dan simulasi humas digital untuk mahasiswa dan praktisi komunikasi.',
  keywords: ['DIGISMART', 'AI Public Communication', 'Humas Digital', 'Analisis Sentimen', 'Social Listening', 'News Generator', 'Manajemen Krisis'],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B1120',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen flex flex-col antialiased">
        <DigismartProvider>
          {children}
        </DigismartProvider>
      </body>
    </html>
  );
}
