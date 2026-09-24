# SınıfDenizi

Referans görseller temel alınarak hazırlanmış Next.js, React ve TypeScript sınıf akvaryumu uygulaması.

## Çalıştırma

Node.js 24 kullanın.

```sh
npm ci
npm run dev
```

Yerel adres: http://127.0.0.1:3000

```sh
npm test
npm run typecheck
npm run build
npm start
```

`npm start`, `out/` içindeki üretim derlemesini 4173 portunda sunar. GitHub Pages derlemesi `NEXT_PUBLIC_BASE_PATH=/sinifdenizi` ile yapılır; workflow yalnızca derlenmiş `out/` klasörünü yayımlar.

## Bu aşamada çalışanlar

- Akvaryum merkezli öğretmen arayüzü; mobil ve akıllı tahta düzeni.
- 30 tür için özgün deniz canlısı çizimleri; üç derinlik katmanı, bağımsız hızlar, yakınlıkla kaçınma ve doğal kenar dönüşleri.
- Aranabilir ve filtrelenebilir balık kataloğu; 27 temel tür ve öğrencinin kendi XP'siyle açılan üç özel tür: Altın balık 500 XP, Gökkuşağı 1.500 XP, Karanlık 3.000 XP.
- Yeni örnek sınıfta 24 farklı temel tür; mevcut `sinifdenizi-v2` kayıtlarında öğrenci seçimi ve tür ID'leri korunur.
- Yüzey ışığı, hareketli su yansımaları, mercan/yosun salınımı, küçük ortam sürüleri ve türe göre yüzme rotaları.
- Duraklatma, azaltılmış hareket tercihi, tam ekran ve klavye ile öğrenci seçimi.
- Öğrenci ekleme, düzenleme ve sınıftan çıkarma; arama, profil ve balık değiştirme; 40 öğrenci sınırı. Yerel fotoğraflar (en fazla 10 MB) tarayıcıda 256 × 256 piksellik küçük bir kareye dönüştürülerek saklanır.
- Tüm sınıfa veya seçilen öğrencilere görev atama, öğrenci bazında tek seferlik onay, XP ve yem ödülleri.
- Yem harcayarak besleme; sınıf XP'sine göre dokuz dekorun açılması ve akvaryuma eklenmesi/kaldırılması.
- Görevlerden türetilen katılım raporları, rozetler ve etkinlik akışı.
- İki örnek çocuk arasında geçiş yapılabilen, düzenleme yapmayan veli görünümü ve öğretmen notu.

## Açık sınırlar

30 türün tamamının çizimi hazırdır. Ana çizimler `assets-src/creatures-original-01.png` ile `creatures-original-05.png` arasındaki beş adet 1.536 × 1.024 piksel RGBA atlasında yer alır; her atlas 3 × 2 düzende altı tür içerir. Uygulama bu atlasları yüklemez: `npm run sprites` (`scripts/build-sprites.ts`) her tür için en fazla 320 piksellik, her dekor için ayrı birer WebP dosyası ve WebP arka plan üretir. Sonuçlar `public/assets/` altına yazılır ve depoya eklenir; ilk açılış yaklaşık 1,9 MB'tır. Özel türlerin seçilememesi eksik görselden değil, öğrencinin XP koşulundan kaynaklanır. Yeni çizimler mevcut deniz hareketlerini, duraklatmayı ve azaltılmış hareket tercihini korur.

Bu bir **çalışan görsel ürün demosudur**, üretim sistemi değildir. Örnek veriler tarayıcıdaki `sinifdenizi-v2` kaydında saklanır. Depolama alanı dolduğu için kaydedilemeyen bir değişiklik ekranda da geri alınır. Bu sürümün okuyamadığı bir kayıt silinmez; `sinifdenizi-v2-yedek-<tarih>` anahtarına taşınır ve örnek sınıf açılır. Gerçek kimlik doğrulama, Supabase bağlantısı, sunucuda öğretmen/veli yetkilendirmesi ve özel fotoğraf depolama henüz bağlı değildir. Rol geçişi yalnızca demo gezintisidir; güvenlik sınırı değildir. Gerçek öğrenci verileri kullanmayın. Eski prototipin kayıtları sessizce taşınmaz veya silinmez; `legacy/index.html` içinde eski prototip korunmuştur.

Balıklar tek pozlu 2D sprite çizimleridir. Mevcut hareket, bütün gövdenin türüne uygun rotada ilerlemesi ve CSS salınımlarıyla sağlanır; ayrı yüzgeç/kuyruk iskelet animasyonları veya kare kare uzuv döngüleri henüz yoktur. 26 numaralı Renkli sürüler tek bileşik çizimdir; bu çizimin içindeki balıklar bağımsız hareket etmez. Akvaryumdaki dekoratif ortam sürüleri ayrı bir hareket katmanıdır. Kaçınma yumuşak bir hareket kuralıdır; yoğun gruplarda görsel örtüşmeler olabilir. Küçük ekranda tam ekran seçeneği kullanılabilir.

## Yapı

- `app/`: sayfa ve duyarlı tasarım sistemi.
- `components/`: ekranlar, formlar, diyalog ve akvaryum.
- `lib/model.ts`: tipler, ödüller ve ilerleme hesapları.
- `lib/species.ts`: 30 sabit tür ID'si, katalog filtreleri ve öğrenci XP kilitleri.
- `lib/creature-art.ts`: çizimi hazır türler ve WebP dosyaları.
- `lib/swimming.ts`: zamana dayalı hareket ve kaçınma motoru.
- `lib/storage.ts`: tarayıcı kaydı, kaydedilemeyen değişikliklerin bildirimi ve okunamayan kayıtların yedeklenmesi.
- `lib/photo.ts`: profil fotoğraflarını küçültme.
- `lib/ids.ts`: HTTPS olmayan okul ağlarında da çalışan kimlik üretimi.
- `assets-src/`: özgün PNG ana çizimler ve atlaslar (yayımlanmaz).
- `public/assets/`: `npm run sprites` ile üretilen küçük WebP canlı, dekor ve arka plan dosyaları.
- `scripts/build-sprites.ts`: atlaslardaki tür kırpımları ve WebP üretimi.
- `design-reference/`: altı ana referans ve korunmuş eski iki dosya.
- `docs/ORIGINAL_CREATURE_BRIEF.md`: özgün karakter tasarım hedefleri, atlas teslim durumu ve ileride hazırlanacak uzuv animasyonları.
- `tests/`: ödül bütünlüğü, veri doğrulama, kayıt ve yedekleme, 40 balık testi ve tarayıcı akışları.

## Tarayıcı kontrolü

Uygulama 4173 portunda çalışırken `npm run test:e2e` çalıştırın. Varsayılan tarayıcı yerel Microsoft Edge'dir. Playwright Chromium için `BROWSER_CHANNEL=chromium` kullanın. `APP_URL` ve `SCREENSHOT_DIR` ile adresi ve ekran görüntüsü klasörünü değiştirebilirsiniz. Test ayrı bir tarayıcı profili kullanır, kullanıcının tarayıcısına dokunmaz.

Görsel üretim yöntemi ve promptlar `ASSET_NOTES.md` içindedir.

Çekiçbaş köpekbalığı (ID 13), baş biçimini belirginleştirmek için ayrıca üretilen `assets-src/creature-hammerhead-original.png` dosyasından kesilir (1536 × 1024, RGBA). Üçüncü atlasın ilk çizimi dosyada korunur ancak bu türün görünümünde kullanılmaz.
