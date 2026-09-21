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
- 12 özgün deniz canlısı, üç derinlik katmanı, bağımsız hızlar, yakınlıkla kaçınma ve doğal kenar dönüşleri.
- Duraklatma, azaltılmış hareket tercihi, tam ekran ve klavye ile öğrenci seçimi.
- Öğrenci ekleme, yerel fotoğraf, arama, profil ve balık değiştirme; 40 öğrenci sınırı.
- Tüm sınıfa veya seçilen öğrencilere görev atama, öğrenci bazında tek seferlik onay, XP ve yem ödülleri.
- Yem harcayarak besleme; sınıf XP'sine göre dokuz dekorun açılması ve akvaryuma eklenmesi/kaldırılması.
- Görevlerden türetilen katılım raporları, rozetler ve etkinlik akışı.
- İki örnek çocuk arasında geçiş yapılabilen, düzenleme yapmayan veli görünümü ve öğretmen notu.

## Açık sınırlar

Bu bir **çalışan görsel ürün demosudur**, üretim sistemi değildir. Örnek veriler tarayıcıdaki `sinifdenizi-v2` kaydında saklanır. Gerçek kimlik doğrulama, Supabase bağlantısı, sunucuda öğretmen/veli yetkilendirmesi ve özel fotoğraf depolama henüz bağlı değildir. Rol geçişi yalnızca demo gezintisidir; güvenlik sınırı değildir. Gerçek öğrenci verileri kullanmayın. Eski prototipin kayıtları sessizce taşınmaz veya silinmez; `legacy/index.html` içinde eski prototip korunmuştur.

Balıklar yüksek kaliteli 2D sprite çizimleridir; ayrı yüzgeç/kuyruk iskelet animasyonları henüz yoktur. Kaçınma yumuşak bir hareket kuralıdır; yoğun gruplarda görsel örtüşmeler olabilir. Küçük ekranda tam ekran seçeneği kullanılabilir.

## Yapı

- `app/`: sayfa ve duyarlı tasarım sistemi.
- `components/`: ekranlar, formlar, diyalog ve akvaryum.
- `lib/model.ts`: tipler, ödüller ve ilerleme hesapları.
- `lib/swimming.ts`: zamana dayalı hareket ve kaçınma motoru.
- `public/assets/`: yeni, özgün PNG ortam ve sprite atlasları.
- `design-reference/`: altı ana referans ve korunmuş eski iki dosya.
- `tests/`: ödül bütünlüğü, veri doğrulama, 40 balık testi ve tarayıcı akışları.

## Tarayıcı kontrolü

Uygulama 4173 portunda çalışırken `npm run test:e2e` çalıştırın. Varsayılan tarayıcı yerel Microsoft Edge'dir. Playwright Chromium için `BROWSER_CHANNEL=chromium` kullanın. `APP_URL` ve `SCREENSHOT_DIR` ile adresi ve ekran görüntüsü klasörünü değiştirebilirsiniz. Test ayrı bir tarayıcı profili kullanır, kullanıcının tarayıcısına dokunmaz.

Görsel üretim yöntemi ve promptlar `ASSET_NOTES.md` içindedir.
