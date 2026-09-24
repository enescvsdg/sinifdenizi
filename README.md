# SınıfDenizi

Referans görseller temel alınarak hazırlanmış Next.js, React ve TypeScript sınıf akvaryumu uygulaması.

## Çalıştırma

Node.js 24 kullanın (`.nvmrc`); en az 22.6 gerekir.

```sh
npm ci
npm run dev
```

Yerel adres: http://127.0.0.1:3000

```sh
npm test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm start
```

`npm start`, `out/` içindeki üretim derlemesini 4173 portunda sunar. GitHub Pages derlemesi `NEXT_PUBLIC_BASE_PATH=/sinifdenizi` ile yapılır; workflow yalnızca derlenmiş `out/` klasörünü yayımlar.

`npm run format` tüm dosyaları Prettier ile biçimlendirir (`legacy/` hariç). `npm run lint`, eslint-config-next'in Next.js, React Hooks ve erişilebilirlik kurallarını oxlint ile çalıştırır; ESLint'in TypeScript eklentisi bu depodaki TypeScript 7'yi henüz desteklemediği için ESLint kullanılmaz. Ayarlar `.oxlintrc.json` içindedir.

Her pull request'te ve `main` dalına her gönderimde `.github/workflows/ci.yml` çalışır: biçim, lint, tip denetimi ve birim testleri; ardından `/sinifdenizi` alt yoluyla derleme ve Playwright Chromium ile tarayıcı testi. Tarayıcı testi başarısız olursa ekran görüntüleri iş akışının çıktılarına eklenir.

## Bu aşamada çalışanlar

- Akvaryum merkezli öğretmen arayüzü; mobil ve akıllı tahta düzeni. Her sayfanın paylaşılabilir bir adresi vardır; tarayıcının geri tuşu ve sayfa yenileme beklendiği gibi çalışır.
- Hızlı işlemler ve onay bekleyen görevlerle ayrı bir öğretmen ana sayfası.
- 30 tür için özgün deniz canlısı çizimleri; üç derinlik katmanı, bağımsız hızlar, yakınlıkla kaçınma ve doğal kenar dönüşleri.
- Aranabilir ve filtrelenebilir balık kataloğu; 27 temel tür ve öğrencinin kendi XP'siyle açılan üç özel tür: Altın balık 500 XP, Gökkuşağı 1.500 XP, Karanlık 3.000 XP.
- Yeni örnek sınıfta 24 farklı temel tür; mevcut `sinifdenizi-v2` kayıtlarında öğrenci seçimi ve tür ID'leri korunur.
- Yüzey ışığı, hareketli su yansımaları, mercan/yosun salınımı, küçük ortam sürüleri ve türe göre yüzme rotaları. Büyük türler (köpekbalıkları, vatoz, kaplumbağa…) daha büyük, küçük balıklar daha küçük çizilir. Animasyon her karede balık başına yalnızca bir `transform` yazar; 40 balıkta stil hesaplaması eskisinin altıda birine indi.
- Duraklatma, azaltılmış hareket tercihi, tam ekran ve klavye ile öğrenci seçimi.
- Okunabilirlik: tüm yazılar en az 12 px ve WCAG AA kontrastındadır (4,5:1); akvaryum üzerindeki yazıların koyu zemini vardır. Kapalı mobil menü klavye odağı almaz, Escape ile kapanır; pencerelerin ekran okuyucuda adı vardır.
- Marka kimliği: `design-reference/01-brand-guide.jpg` içindeki altı renk `app/globals.css` başında `--brand-*` değişkenleri olarak tanımlıdır; açık zemin üzerindeki yazılar için 4,5:1 kontrastı sağlayan koyu tonları (`--brand-*-text`) ayrıca vardır. Tarayıcı sekmesi, ana ekran ve uygulama olarak kurulum için palyaço balıklı ikonlar ve `manifest.webmanifest` bulunur; manifestteki adresler göreli olduğundan `/sinifdenizi/` gibi bir alt yolda da doğru çalışır.
- Öğrenci ekleme, düzenleme ve sınıftan çıkarma; arama, profil ve balık değiştirme; 40 öğrenci sınırı. Yerel fotoğraflar (en fazla 10 MB) tarayıcıda 256 × 256 piksellik küçük bir kareye dönüştürülerek saklanır.
- Tüm sınıfa veya seçilen öğrencilere görev atama, öğrenci bazında tek seferlik onay, XP ve yem ödülleri. Onay geri alınabilir (verilen ödül aynen geri çekilir); görevler düzenlenip silinebilir (silinen görevin ödülleri geri alınır). Onayların ve etkinliklerin zamanı kaydedilir; etkinlikler "5 dk önce", "Dün" gibi gösterilir, süresi geçen görevler işaretlenir.
- Yem harcayarak besleme; öğrenci başına ortalama XP'ye göre dokuz dekorun açılması ve akvaryuma eklenmesi/kaldırılması. Ortalama sınıf büyüklüğüyle değişmediği için 15 ve 40 kişilik sınıflar aynı hızda ilerler; sınıf seviyesi akvaryumun açılan aşamasını gösterir. Her dekorun sahnede kendi sabit yeri vardır (`lib/decor-slots.ts`), birini kaldırmak diğerlerini oynatmaz.
- Görevlerden türetilen katılım raporları, rozetler ve etkinlik akışı.
- İki örnek çocuk arasında geçiş yapılabilen, düzenleme yapmayan veli görünümü ve öğretmen notu.

## Açık sınırlar

30 türün tamamının çizimi hazırdır. Ana çizimler `assets-src/creatures-original-01.png` ile `creatures-original-05.png` arasındaki beş adet 1.536 × 1.024 piksel RGBA atlasında yer alır; her atlas 3 × 2 düzende altı tür içerir. Uygulama bu atlasları yüklemez: `npm run sprites` (`scripts/build-sprites.ts`) her tür için en fazla 320 piksellik, her dekor için ayrı birer WebP dosyası ve WebP arka plan üretir. Sonuçlar `public/assets/` altına yazılır ve depoya eklenir; ilk açılış yaklaşık 2 MB'tır. Özel türlerin seçilememesi eksik görselden değil, öğrencinin XP koşulundan kaynaklanır. Yeni çizimler mevcut deniz hareketlerini, duraklatmayı ve azaltılmış hareket tercihini korur.

Bu bir **çalışan görsel ürün demosudur**, üretim sistemi değildir. Örnek veriler tarayıcıdaki `sinifdenizi-v2` kaydında saklanır. Depolama alanı dolduğu için kaydedilemeyen bir değişiklik ekranda da geri alınır. Bu sürümün okuyamadığı bir kayıt silinmez; `sinifdenizi-v2-yedek-<tarih>` anahtarına taşınır ve örnek sınıf açılır. Gerçek kimlik doğrulama, Supabase bağlantısı, sunucuda öğretmen/veli yetkilendirmesi ve özel fotoğraf depolama henüz bağlı değildir. Rol geçişi yalnızca demo gezintisidir; güvenlik sınırı değildir. Gerçek öğrenci verileri kullanmayın. Eski prototipin kayıtları sessizce taşınmaz veya silinmez; `legacy/index.html` içinde eski prototip korunmuştur.

Balıklar tek pozlu 2D sprite çizimleridir. Mevcut hareket, bütün gövdenin türüne uygun rotada ilerlemesi ve CSS salınımlarıyla sağlanır; ayrı yüzgeç/kuyruk iskelet animasyonları veya kare kare uzuv döngüleri henüz yoktur. 26 numaralı Renkli sürüler tek bileşik çizimdir; bu çizimin içindeki balıklar bağımsız hareket etmez. Akvaryumdaki dekoratif ortam sürüleri ayrı bir hareket katmanıdır. Kaçınma yumuşak bir hareket kuralıdır; yoğun gruplarda görsel örtüşmeler olabilir. Küçük ekranda tam ekran seçeneği kullanılabilir.

## Yapı

- `app/`: rotalar ve duyarlı tasarım sistemi. Her sayfanın kendi adresi vardır: `/` akvaryum, `/ana-sayfa/`, `/ogrenciler/`, `/gorevler/`, `/dekorasyonlar/`, `/rozetler/`, `/raporlar/`, `/ayarlar/`, `/veli/` ve `/giris/`. Sınıf sayfaları `app/(sinif)/layout.tsx` içindeki ortak kabuğu ve durumu paylaşır.
- `components/school/`: sınıf durumu ve kayıt (`state.tsx`), kenar çubuğu ile üst çubuk (`shell.tsx`), öğrenci profili ve her sayfanın bileşeni (`pages/`).
- `components/`: formlar, diyalog, balık kataloğu ve akvaryum.
- `lib/routes.ts`: sayfa adresleri ve başlıkları.
- `lib/model.ts`: tipler, ödüller ve ilerleme hesapları.
- `lib/species.ts`: 30 sabit tür ID'si, katalog filtreleri ve öğrenci XP kilitleri.
- `lib/creature-art.ts`: çizimi hazır türler ve WebP dosyaları.
- `lib/swimming.ts`: zamana dayalı hareket ve kaçınma motoru.
- `lib/storage.ts`: tarayıcı kaydı, kaydedilemeyen değişikliklerin bildirimi ve okunamayan kayıtların yedeklenmesi.
- `lib/photo.ts`: profil fotoğraflarını küçültme.
- `lib/ids.ts`: HTTPS olmayan okul ağlarında da çalışan kimlik üretimi.
- `assets-src/`: özgün PNG ana çizimler ve atlaslar (yayımlanmaz).
- `public/assets/`: `npm run sprites` ile üretilen küçük WebP canlı, dekor ve arka plan dosyaları.
- `app/icon.png`, `app/apple-icon.png`, `public/icons/`: yine `npm run sprites` ile üretilen uygulama ikonları; `app/manifest.ts` bunları kurulum bilgisine ekler.
- `scripts/build-sprites.ts`: atlaslardaki tür kırpımları, WebP ve ikon üretimi.
- `design-reference/`: altı ana referans; ilk yüklemeleri bozuk olduğu için bunlardan yeniden üretilen `brand-guide.jpg` ve `reference-board.jpg` (ayrıntı `ASSET_NOTES.md` içinde).
- `docs/ORIGINAL_CREATURE_BRIEF.md`: özgün karakter tasarım hedefleri, atlas teslim durumu ve ileride hazırlanacak uzuv animasyonları.
- `tests/`: ödül bütünlüğü, veri doğrulama, kayıt ve yedekleme, 40 balık testi, ikon ve tasarım referansı dosyalarının bütünlüğü ve tarayıcı akışları.

## Tarayıcı kontrolü

Uygulama 4173 portunda çalışırken `npm run test:e2e` çalıştırın. Varsayılan tarayıcı yerel Microsoft Edge'dir. Playwright Chromium için `BROWSER_CHANNEL=chromium` kullanın. `APP_URL` ve `SCREENSHOT_DIR` ile adresi ve ekran görüntüsü klasörünü değiştirebilirsiniz. Test ayrı bir tarayıcı profili kullanır, kullanıcının tarayıcısına dokunmaz. Test ayrıca birkaç sayfada 12 px'ten küçük ya da 4,5:1'in altında kontrastlı görünür yazı olmadığını ve kapalı mobil menünün klavye odağı almadığını denetler.

Görsel üretim yöntemi ve promptlar `ASSET_NOTES.md` içindedir.

Çekiçbaş köpekbalığı (ID 13), baş biçimini belirginleştirmek için ayrıca üretilen `assets-src/creature-hammerhead-original.png` dosyasından kesilir (1536 × 1024, RGBA). Üçüncü atlasın ilk çizimi dosyada korunur ancak bu türün görünümünde kullanılmaz.

## Lisans

Tüm hakları saklıdır (© 2026 SınıfDenizi ekibi). Kod, çizimler, marka ve belgeler izinsiz kopyalanamaz veya kullanılamaz; ayrıntılar `LICENSE` dosyasında. Bağımlılıklar kendi lisanslarına tabidir.
