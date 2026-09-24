import Link from "next/link";
import { ArrowUpRight, GraduationCap, Heart, ShieldCheck } from "lucide-react";
import { Fish, asset } from "../../sprites";
import { Brand } from "../ui";
import { paths } from "@/lib/routes";

export function WelcomePage() {
  return (
    <div className="welcome">
      <div
        className="welcome-art"
        style={{ backgroundImage: `url(${asset("aquarium.webp")})` }}
      >
        <Brand />
        <div>
          <span className="eyebrow">HER SINIFIN BİR DENİZİ VAR</span>
          <h1>
            Küçük adımlar.
            <br />
            Kocaman bir dünya.
          </h1>
          <p>Öğrenmenin heyecanını birlikte büyütün.</p>
        </div>
        <Fish type={0} className="welcome-fish" />
      </div>
      <div className="welcome-form">
        <Brand />
        <span className="eyebrow">SINIFINIZA HOŞ GELDİNİZ</span>
        <h2>Birlikte keşfedelim.</h2>
        <p>Örnek sınıfı öğretmen veya veli olarak inceleyin.</p>
        <Link className="primary" href={paths.aquarium}>
          <GraduationCap size={20} /> Öğretmen demosunu aç{" "}
          <ArrowUpRight size={18} />
        </Link>
        <Link className="secondary" href={paths.parent}>
          <Heart size={20} /> Veli demosunu aç <ArrowUpRight size={18} />
        </Link>
        <div className="demo-explanation">
          <ShieldCheck size={20} />
          <p>
            Bu sürüm örnek verilerle çalışır. Gerçek kullanıcı girişi ve bulut
            senkronizasyonu henüz bağlı değildir.
          </p>
        </div>
      </div>
    </div>
  );
}
