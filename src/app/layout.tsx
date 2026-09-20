import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: { default: 'SınıfDenizi — Öğren. Kazan. Büyüt.', template: '%s | SınıfDenizi' },
  description:
    'Her küçük başarı, kocaman bir deniz. Öğretmenler, öğrenciler ve veliler için sınıfın ortak gelişim alanı.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <a className="skip" href="#main">
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
