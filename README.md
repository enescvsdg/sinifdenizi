# SınıfDenizi

**Öğren. Kazan. Büyüt.** Öğretmen ve veli hesaplarını, öğrenci gelişimini ve sınıfın ortak akvaryumunu birleştiren Next.js uygulaması.

Bu dal, `CODEX_BRIEF.md` hedef mimarisine geçiştir. Eski tek dosyalık demo `legacy/index.html` altında arşivlenmiştir; uygulama localStorage kullanmaz. GitHub Pages iş akışı kaldırılmıştır: oturumlar ve sunucu işlemleri için Node.js çalıştıran bir yayın ortamı gerekir. Mevcut yayın, bu dal birleştirilip yeniden dağıtılana kadar değişmez.

## Çalıştırma

Node.js 24 LTS kullanın.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

`http://localhost:3000` giriş ekranıdır. Supabase olmadan `/demo` örnek sınıfı gezilebilir. Buradaki kişiler kurgusaldır; işlemler salt okunurdur. `/demo?role=parent` veli önizlemesidir. Bağlantı kurulmadan gerçek giriş düğmesi devre dışıdır.

## Supabase kurulumu

1. Bir Supabase projesi oluşturun. SQL Editor üzerinden `supabase/migrations/202609200001_initial.sql` dosyasını **bir kez, yeni bir veritabanında** çalıştırın. Alternatif olarak CLI ile projeyi bağlayıp `supabase db push` kullanın.
2. `.env.local` içine proje URL'sini ve publishable key'i yazın. Uygulama service-role anahtarı kullanmaz.
3. Auth → URL Configuration bölümünde Site URL'yi ve izin verilen `/auth/confirm` yönlendirmelerini ayarlayın: yerelde `http://localhost:3000/auth/confirm`, canlıda `https://ALAN_ADINIZ/auth/confirm`.
4. `NEXT_PUBLIC_SITE_URL` değişkenini aynı kök adres olarak belirleyin.
5. E-posta onayını açık tutun. Canlı ortam için kendi SMTP hizmetinizi ve Auth istek sınırlarını yapılandırın. Varsayılan doğrulama bağlantısı PKCE callback ile desteklenir. Cihazlar arası doğrulama için e-posta şablonunda `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email` kullanabilirsiniz.
6. Öğretmen hesabı oluşturup e-postayı doğrulayın; sınıf ve öğrenci ekleyin. Veli de kayıt olup e-postasını doğrulasın. Öğretmen öğrenci profilinde velinin tam e-posta adresiyle bağlantıyı kursun. Aynı veli birden fazla öğrenciye bağlanabilir. Öğrencilerin giriş hesabı yoktur.

## Mevcut akışlar

- Öğretmen/veli kayıt, doğrulama, giriş, çıkış; sunucuda doğrulanan oturum ve değiştirilemeyen rol.
- Çoklu sınıf; öğrenci ekleme, düzenleme, silme ve balık seçimi.
- Gizli fotoğraf deposu, 3 MB JPEG/PNG/WebP kontrolü, 5 dakikalık signed URL.
- Tüm sınıfa veya seçilen öğrencilere görev; öğretmen onayı; görev düzenleme/silme. Onaylanmış görevler geçmiş ödülleri korumak için değiştirilemez.
- Tek veritabanı işlemiyle XP, yem, seviye, rozet ve ortak dekorasyon. Tekrar onay çift ödül vermez.
- Veli bağlantısı ekleme/kaldırma; çocuğa özel salt okunur görünüm ve çocuk seçici.
- Duyuruların velilerle paylaşımı, öğrenci ve görev raporları, son 7 günlük etkinlik.
- 12 özgün Canvas deniz canlısı; yakınlık ızgarası, uzaklaşma, doğal kenar dönüşü, derinlik, tam ekran ve duraklatma. Sürekli isim etiketleri yoktur. Seçim kartında isim gösterimi varsayılan kapalıdır.
- Mobil düzen, klavyeyle balık seçimi, azaltılmış hareket tercihi, hata/durum mesajları. Yazı tipleri uygulamadan sunulur.

## Veri ve yetki sınırları

`profiles`, brief'teki `users` modelinin karşılığıdır ve Supabase `auth.users` kaydına bağlıdır. `students.photo_path` özel depo yolunu saklar; public URL saklanmaz. Öğretmen yalnızca kendi sınıflarına yazabilir. Veli yalnızca bağlı çocuklarını, onların görevlerini ve paylaşılan sınıf bilgilerini görebilir. Sınıfın tüm öğrenci kayıtları veliye gönderilmez. Fotoğraflar akvaryumda gösterilmez.

RLS yanında sütun izinleri de vardır. İstemci doğrudan XP, yem, rol veya sahiplik değiştiremez. Onay ve veli bağlantısı işlevleri yetki kontrolü yapar. Fotoğraf yolu başka öğrenciye ait fotoğrafa yönlendirilemez. Erişim kaldırıldığında önceden üretilmiş signed URL en fazla kalan 5 dakikalık süresi boyunca çalışabilir.

Öğrenci silme görev geçmişini ve rozetlerini kaldırır. Tarihsel sınıf başarısı ve açılmış dekorasyonlar geri alınmaz. Silme formu ek onay ister.

## Dizinler

```text
src/app/                 Sayfalar, Auth callback ve sunucu işlemleri
src/components/          Paylaşılan arayüz ve akvaryum
src/lib/                 Veri, oturum, doğrulama, ilerleme ve yüzme modeli
supabase/migrations/     Şema, RLS, özel depo ve atomik işlevler
tests/                   PostgreSQL yetki/ödül ve birim testleri
tests/e2e/               Masaüstü ve mobil tarayıcı testleri
legacy/                  Üretimde sunulmayan eski prototip
```

## Doğrulama

```sh
npm run check
npm run test:e2e
```

Yerel tarayıcı testleri kurulu Chrome'u; CI indirilen Chromium'u kullanır. PostgreSQL testleri PGlite üzerinde gerçek migration'ı çalıştırır; Auth ve Storage tabloları test karşılıklarıdır. RLS, sınıflar arası erişim, veli salt okunurluğu, ödül sahteciliği, tekrar onay, duyurular, fotoğraf ve bağlantı kaldırma sınanır. GitHub Actions lint, TypeScript, birim/veritabanı testleri, production build ve masaüstü/mobil tarayıcı senaryolarını çalıştırır.

## Yayınlama

Vercel veya Node.js 24 destekleyen bir platform kullanın. Vercel'de projeyi **Next.js** olarak içe aktarın, `.env.example` içindeki üç değişkeni ekleyin ve üretim alan adını Supabase Auth yönlendirmelerine ekleyin. Kendi Node.js sunucunuz için:

```sh
npm ci
npm run build
npm run start
```

Ortam değişkenleri build ve çalışma zamanında bulunmalıdır. Oturumlu sayfaları ve signed URL'leri ortak CDN önbelleğine almayın. Migration uygulanmadan gerçek kullanıcı trafiğine açmayın.

## Kalan doğrulama ve sınırlar

Bu çalışma canlı Supabase projesine veya hosting hesabına bağlanmamıştır. Gerçek e-posta teslimi, iki ayrı öğretmen ve veliyle uçtan uca kayıt/giriş, fotoğraf yükleme, bağlantı kaldırma ve eşzamanlı onay denemeleri canlı test projesinde yapılmalıdır. UI otomasyonları kurgusal veri kullanır. RLS'nin gerçek Storage hizmetiyle kontrolü, yedekleme/geri yükleme ve ortam ayarları canlıya geçişin kalan adımlarıdır.

Önceki onaylı tasarım görselleri repoda yoktur. Mavi/turkuaz, mercan/sarı vurgular, Nunito, özgün balık ve geniş akvaryum brief'e göre uygulanmıştır; önceki tasarımla birebir eşleşme doğrulanmamıştır. Canvas çizimleri özgün vektör varlıklardır; sinematik 3D asset seti değildir.

Şifre sıfırlama, özel balık türü açma kuralları, e-posta bildirimleri ve öğrenci bazlı özel öğretmen notları bu milestone'da yoktur. Çekirdek görev → onay → ödül → akvaryum gelişimi akışı uygulanmıştır.
