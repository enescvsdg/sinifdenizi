import Link from 'next/link';
import { Waves, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AuthForm } from '@/components/auth-form';
import { configured } from '@/lib/supabase/server';
import { Aquarium } from '@/components/aquarium';
import { demoData } from '@/lib/demo';
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  return (
    <main id="main" className="login">
      <section className="login-sea">
        <Link className="brand" href="/giris">
          <Waves /> SınıfDenizi<span className="brand-dot">.</span>
        </Link>
        <div className="login-copy">
          <span className="eyebrow">BİRLİKTE BÜYÜYEN BİR DÜNYA</span>
          <h1>
            Küçük başarılar.
            <br />
            Kocaman bir <em>deniz.</em>
          </h1>
          <p>
            Öğrenmenin heyecanı sınıfınızda yüzsün.
            <br />
            Her görev bir adım, her öğrenci bu denizin bir parçası.
          </p>
        </div>
        <Aquarium students={demoData.students.slice(0, 8)} decorLevel={2} compact />
        <div className="login-foot">
          <span>
            <Sparkles size={16} /> Öğren. Kazan. Büyüt.
          </span>
          <span>Birlikte daha derine.</span>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <span className="pill">SINIFININ YENİ HİKÂYESİ</span>
          <h2>Tekrar hoş geldin.</h2>
          <p className="muted">Sınıfındaki güzel gelişmeleri keşfet.</p>
          {message && (
            <p role="status" className="notice">
              {message}
            </p>
          )}
          {!configured() && (
            <p className="notice">
              Canlı hesap bağlantısı henüz kurulmadı. Aşağıdaki örnek sınıfı gezebilirsin.
            </p>
          )}
          <AuthForm enabled={configured()} />
          <Link className="demo-link" href="/demo">
            Örnek sınıfı keşfet <ArrowUpRight size={18} />
          </Link>
          <div className="trust">
            <ShieldCheck size={18} /> Öğrenci verileri, yalnızca yetkili kişilerle.
          </div>
        </div>
        <span className="muted small">SınıfDenizi · Merakla öğrenen sınıflar için.</span>
      </section>
    </main>
  );
}
