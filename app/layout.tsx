import type { Metadata, Viewport } from 'next';
import './globals.css';
import { DigismartProvider } from '@/lib/digismartContext';

export const metadata: Metadata = {
  title: 'DIGISMART | AI Command Center - Komunikasi Publik Digital',
  description: 'Platform AI Public Communication untuk pemantauan isu, generator berita cerdas 5W+1H, analisis sentimen NLP, respons krisis, dan simulasi kehumasan digital enterprise.',
  keywords: ['DIGISMART', 'AI Public Communication', 'Humas Digital', 'Analisis Sentimen', 'Social Listening', 'News Generator', 'Manajemen Krisis', 'Command Center'],
  manifest: '/manifest.json',
  authors: [{ name: 'DIGISMART Enterprise' }],
  openGraph: {
    title: 'DIGISMART v2.0 - AI Public Communication Command Center',
    description: 'Pusat komando pemantauan isu, generator berita AI 5W+1H, analisa sentimen publik, dan simulasi mitigasi krisis humas digital.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'DIGISMART',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIGISMART v2.0 - AI Public Communication Hub',
    description: 'Platform AI Kehumasan & Analisis Sentimen Publik Digital.',
  },
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
