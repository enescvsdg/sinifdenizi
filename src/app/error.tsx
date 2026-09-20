'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="error-page">
      <h1>Denize ulaşamadık.</h1>
      <p>Bağlantıyı ve veritabanı kurulumunu kontrol edip yeniden deneyin.</p>
      <button className="button" onClick={reset}>
        Yeniden dene
      </button>
    </main>
  );
}
