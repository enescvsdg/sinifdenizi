# Özgün görsel varlıklar

2026-09-21: Yerleşik imagegen aracı kullanıldı; CLI veya API anahtarı kullanılmadı. PNG dosyaları proje içine kopyalandı; kaynak referanslar değiştirilmedi. Uygulama dış görsel servislerine bağlanmaz.

## Yeni özgün karakter seti

`assets-src/creatures-original-01.png`–`creatures-original-05.png`, 30 türün yeni çizimlerini içerir. Her atlas 1536 × 1024 piksel ve gerçek alfa kanallı PNG'dir. İlk atlas sıfırdan üretildi; sonraki atlaslarda yalnız bu yeni çizimlerin malzeme ve ışık dili referans alındı. Kaynak kullanıcı referansları ve eski atlas dosyaları korunmuştur.

PNG ana dosyalar `assets-src/` altında durur ve yayımlanmaz. Sayısal tür kimlikleri değişmeden, gerçek çizim sınırları ve gerekli kırpma maskeleri `scripts/build-sprites.ts` içinde eşlenir; `npm run sprites` her tür, her dekor ve arka plan için `public/assets/` altına küçük WebP dosyaları yazar. Üretimde kullanılan son promptların tamamı [docs/ASSET_GENERATION_PROMPTS.md](docs/ASSET_GENERATION_PROMPTS.md) dosyasındadır. Tasarım hedefleri [docs/ORIGINAL_CREATURE_BRIEF.md](docs/ORIGINAL_CREATURE_BRIEF.md) içindedir. Aşağıdaki `creatures.png` eski setin üretim kaydıdır.

## `assets-src/aquarium.png`

Prompt: Create a production game background asset, landscape 16:9, for SınıfDenizi classroom aquarium. Rich high-end stylized 3D underwater illustration, luminous turquoise water, layered blue distant rock formations, shafts of sunlight and underwater caustics, fine sandy seabed. Colorful rounded pink violet orange corals frame lower corners, subtle seaweed left and right. Wide open central 70% swimming area and deep blue gradient, distant small ancient stone arch at far right, subtle old shipwreck silhouette far left. Friendly premium children's educational game, beautiful dimensional materials, cinematic light. NO fish, NO animals, NO text, NO UI, NO labels, NO logos. This will be a moving aquarium background with separate animated creature sprites on top; reserve spacious clean water for them. Original scenery.

## `assets-src/creatures.png`

Prompt: Production game sprite atlas on a genuinely TRANSPARENT alpha background. Exactly 12 separate original friendly sea creatures in an evenly spaced 4 COLUMN by 3 ROW grid, each within its own equal square cell, generous padding, no touching other cells. Each creature is full body side view facing RIGHT. Consistent premium polished dimensional 3D illustrated educational aquarium game style, soft specular scales and fins, expressive small warm eyes, species-correct distinctive silhouettes, NO copying known animation characters. Row 1: orange white striped clownfish; royal blue tang with yellow tail; golden yellow tang with tall dorsal fin; cream yellow black-striped butterflyfish. Row 2: red white lionfish with delicate radiating fins; round beige spotted pufferfish; curled orange seahorse; broad blue manta ray. Row 3: green sea turtle with brown patterned shell; friendly teal reef shark; coral purple octopus with eight curly arms; luminous lavender translucent jellyfish with trailing tentacles. No water, no seabed, no ground, no text, no labels, no grid lines, no drop shadow cast onto background, no background color. Every silhouette isolated with real alpha transparency. Landscape 4:3 atlas. Detailed sophisticated game asset quality, rich material shading, not flat icons or clipart.

Bu eski atlas artık kullanılmaz; kayıt olarak saklanır.

## `assets-src/decorations.png`

Prompt: Create one production game decoration sprite atlas, genuine TRANSPARENT alpha background, exactly 9 isolated underwater props in a perfectly regular 3 columns x 3 rows square grid. Each object must fit well INSIDE its own equal cell with 15 percent transparent margins on every side, no objects crossing cells, full object visible, no shadows beyond object. Premium colorful dimensional 3D children's aquarium game illustration. Row 1: cluster of swaying green kelp; smooth blue rocks; pink orange violet coral cluster. Row 2: open wooden treasure chest with golden coins; small broken wooden shipwreck; weathered stone arch. Row 3: white red lighthouse on blue rock; group of tiny luminous lavender jellyfish; ornate small blue underwater castle. No words, no UI, no labels, no grid, no backgrounds, no ocean. Original detailed assets with soft cinematic material lighting. All props individually isolated.

## Referans incelemesi

01: kitap/balık markası, Nunito, mavi-turkuaz ve sıcak vurgu renkleri.
02: öğretmen kartları, görev formu ve öğrenci profili.
03: tür bazında farklı siluet, renk ve malzeme dokusu.
04: sınıf başarısı ile dekor kilitleri ve yerleştirme.
05: geniş yüzme alanı, derinlik, tam ekran kullanım.
06: güçlü akvaryum vitrini, öğretmen/veli ayrımı, mobil uyum.

Eski `brand-guide.jpg` ve `reference-board.jpg` dosyaları görüntüleyicide açılamadı: ilk yüklemeleri (commit `7730892`) yaklaşık 7,5 KB'ta kesilmişti, `brand-guide.jpg`'nin başlığında ayrıca bozulmuş baytlar vardı. Kullanıcının sonradan sağladığı altı JPEG ana görsel kaynak olarak incelendi.

2026-09-24: İki dosya bu altı kaynaktan yeniden üretildi. `brand-guide.jpg`, bozuk başlıkta kayıtlı 900 × 822 boyutuyla `01-brand-guide.jpg`'nin küçültülmüş hâlidir (en-boy oranları aynıdır). `reference-board.jpg`, 01–06'yı etiketleriyle gösteren 1174 piksel genişliğinde bir özet panodur. Bozuk ilk hâller git geçmişinde durur.

Çekiçbaş köpekbalığı (ID 13), baş biçimini belirginleştirmek için ayrıca üretilen `assets-src/creature-hammerhead-original.png` dosyasından kesilir (1536 × 1024, RGBA). Üçüncü atlasın ilk çizimi dosyada korunur ancak bu türün görünümünde kullanılmaz.
