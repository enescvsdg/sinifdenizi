import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="error-page">
      <h1>Bu kıyıda bir sayfa yok.</h1>
      <Link className="button" href="/panel">
        Sınıfına dön
      </Link>
    </main>
  );
}
