# SınıfDenizi — Codex Handoff Brief

Bu dosya, ChatGPT ile yapılan ürün/tasarım kararlarını Codex'e devretmek için hazırlanmıştır. Amaç projeyi mevcut prototipten gerçek, profesyonel bir V1 ürüne taşımaktır.

## Görsel Referanslar — ÖNCELİKLİ

Codex yalnızca bu metne göre serbest tasarım üretmemeli. Repo içindeki görsel referansları açıp inceleyerek UI'ı bunlara yaklaştırmalıdır.

- `design-reference/reference-board.jpg` — konuşma boyunca beğenilen marka, öğretmen/veli ekranları, balık çeşitliliği, sınıf başarısına bağlı dekorasyon ve geniş/tam ekran akvaryum tasarımlarının toplu referans panosu.
- `design-reference/brand-guide.jpg` — logo, renk paleti, tipografi, uygulama ikonu ve marka dili için ana görsel referans.

### UI uygulamasından önce zorunlu inceleme

Codex, herhangi bir UI uygulamasına veya yeniden tasarımına başlamadan önce aşağıdaki altı yüksek çözünürlüklü referans dosyasının tamamını açıp görsel olarak incelemelidir:

- `design-reference/01-brand-guide.jpg` — marka, logo, renk paleti ve tipografi.
- `design-reference/02-core-ui-flow.jpg` — temel ekranlar ve arayüz akışı.
- `design-reference/03-fish-variety.jpg` — balık türleri, siluetleri, modelleme ve asset kalitesi.
- `design-reference/04-class-success-decor.jpg` — sınıf başarısına bağlı dekorasyon gelişimi.
- `design-reference/05-wide-fullscreen-aquarium.jpg` — geniş, derinlikli ve tam ekran akvaryum düzeni.
- `design-reference/06-teacher-parent-product.jpg` — öğretmen ve veli ürün ekranları.

Bu altı dosya ana görsel referanslardır; yalnızca dosya adlarını veya bu brief'i okumak yeterli değildir. Balıkların gövde, yüzgeç, kuyruk, desen ve tür bazındaki farklılıklarını özellikle üçüncü referansa göre özgün ve profesyonel kalitede modelle. Uygulanan ekranları ilgili referanslarla görsel olarak karşılaştır.

Dosyalardan herhangi biri eksikse veya açılamıyorsa eksik yolu açıkça bildir; tüm referanslar erişilebilir olup incelenmeden UI uygulamasına başlama. Mevcut `design-reference/reference-board.jpg` ve `design-reference/brand-guide.jpg` dosyalarını koru ve ek referans olarak incele; bunlar altı ayrı dosyanın yerine geçmez.

### Görsel uyum talimatı
- Bu görseller sadece ilham değil, ürünün kabul edilmiş tasarım yönüdür.
- Genel kompozisyon, renk dili, kart yapıları, deniz atmosferi, illüstrasyon kalitesi ve akvaryum yoğunluğu bu referanslara yakın olmalıdır.
- Basit emoji, generic icon-only aquarium veya düz gradient kutu kullanma.
- Balıklar özgün, sevimli, yüksek kaliteli 2D/3D-illüstratif assetler olmalı.
- Akvaryum ana vitrin ekranıdır; referans panosundaki geniş, canlı, derinlikli, mercan/dekor zenginliği olan görsel kalite hedeflenmelidir.
- Öğretmen paneli ve veli panelinde beyaz/çok açık zemin, mavi-turkuaz marka renkleri, yumuşak gölge ve yuvarlatılmış kart dili korunmalıdır.
- Referans görsellerindeki üçüncü taraf karakterlere benzeyen detayları birebir kopyalama; aynı sıcaklık ve sinematik deniz hissini özgün assetlerle üret.

Codex UI uygulamasına başlamadan önce yukarıdaki altı ana referansı ve mevcut iki ek referansı mutlaka incelemeli ve kendi uygulamasını ekran ekran onlarla karşılaştırmalıdır.

## Ürün Özeti

**Ürün adı:** SınıfDenizi  
**Slogan:** Öğren. Kazan. Büyüt.  
**Temel fikir:** Öğrencilerin görev/ödev başarıları bireysel balıklarını geliştirir; sınıfın toplu başarısı ise ortak akvaryumu ve dekorasyonları geliştirir.

SınıfDenizi öğretmen, öğrenci profili ve veli takibini birleştiren oyunlaştırılmış bir sınıf platformudur.

## Kullanıcı Rolleri

### 1. Öğretmen
Öğretmen gerçek kullanıcı hesabına sahiptir ve sistemi yönetir.

Yetkiler:
- sınıf oluşturma/yönetme
- öğrenci ekleme/düzenleme
- öğrenci profil fotoğrafı yükleme
- öğrenciye balık atama/değiştirme
- görev oluşturma
- XP, yem ve rozet sistemi
- görev tamamlama/onay takibi
- sınıf akvaryumunu yönetme
- toplu başarı hedefleri
- raporlar/istatistikler
- veliye gösterilecek bilgileri yönetme

### 2. Öğrenci
Öğrenci için ayrı giriş hesabı OLMAYACAK.

Öğrenci sistemde öğretmenin oluşturduğu bir profil kaydıdır.

Her öğrenci profilinde:
- ad soyad
- profil fotoğrafı
- sınıf
- isteğe bağlı öğrenci numarası
- balık türü
- seviye
- XP
- yem
- tamamlanan görevler
- bekleyen görevler
- rozetler
- başarı geçmişi
- balık gelişimi

### 3. Veli
Veli gerçek kullanıcı hesabına sahiptir.

Veli ekranı ağırlıklı olarak read-only olmalıdır.

Veli görebilmeli:
- kendi çocuğunun başarı durumu
- tamamlanan görevler
- bekleyen görevler
- rozetler
- balık seviyesi
- XP/yem durumu
- gelişim grafikleri
- öğretmenin paylaştığı not/duyurular
- sınıfın genel gelişim durumunun uygun görülen kısmı

Aynı veli birden fazla çocuğa bağlı olabilmeli ve çocuklar arasında geçiş yapabilmeli.

## Tasarım Yönü

Tema:
- profesyonel ama çocuk dostu
- okyanus / akvaryum
- mavi / turkuaz ana palet
- mercan turuncusu ve sarı vurgu
- rounded UI
- sıcak, güvenilir, modern

Önceki marka tasarımında kullanılan yön:
- SınıfDenizi logosu
- kitap + deniz/balık metaforu
- Nunito benzeri yuvarlak, okunabilir tipografi
- slogan: "Öğren. Kazan. Büyüt."

ÖNEMLİ: İlk web prototipinde emoji balıklar kullanılmıştı ve bu kesinlikle nihai kalite değildir. Emoji tabanlı balık kullanma.

## Akvaryum — En Kritik Özellik

Akvaryum ürünün merkezidir.

Gereksinimler:
- geniş, ferah, kalabalık sınıfta bile okunabilir
- 25-40 öğrenci için kargaşa yaratmamalı
- tam ekran modu olmalı
- akıllı tahta/projeksiyon için uygun olmalı
- balıklar statik değil, serbestçe yüzmeli
- bağımsız hız/yön davranışları olmalı
- birbirlerine çarpmamalı
- birbirlerinden kaçınmalı
- ekran kenarlarından doğal şekilde dönmeli
- farklı derinlik bölgelerine dağılmalı
- isim etiketi sürekli görünmemeli
- balığa hover/tap/click olduğunda öğrenci bilgisi açılmalı
- seçilen balık için öğrenci profil kartı gösterilmeli

### Balık çeşitliliği
Balıklar yüksek görsel kaliteye sahip özgün assetler olmalı.

Örnek türler:
- palyaço balığı
- mavi tang
- sarı tang
- kelebek balığı
- aslan balığı
- balon balığı
- denizatı
- manta vatoz
- deniz kaplumbağası
- köpekbalığı
- ahtapot / denizanası gibi özel türler

"Kayıp Balık Nemo" gibi sıcak, sevimli, sinematik deniz karakterlerinden esinlenen bir his isteniyor; ancak üçüncü taraf karakterleri birebir kopyalama. Özgün tasarla.

## Oyun Mekaniği

Ana döngü:
1. öğretmen görev verir
2. öğrenci görevi tamamlar
3. öğretmen onaylar
4. öğrenci XP + yem kazanır
5. bireysel balık gelişir
6. rozet/ödül açılır
7. sınıfın ortak başarısı yükselir
8. akvaryuma yeni dekorasyonlar açılır

### Bireysel başarı
Bireysel başarı öğrencinin balığını geliştirir:
- seviye
- görünüm
- özel detaylar
- yeni türler
- rozetler

### Toplu başarı
Sınıfın ortak başarısı akvaryumu geliştirir.

Örnek unlock sırası:
- başlangıç: sade kaya + yosun
- renkli mercanlar
- hazine sandığı
- batık gemi
- taş kemer / mağara
- deniz feneri
- ışıklı denizanaları
- su altı kalesi / özel efsane dekor

Toplu başarı metrikleri:
- görev tamamlama oranı
- katılım oranı
- toplam tamamlanan görev
- sınıf hedefleri
- kazanılan rozet sayısı

## Temel Ekranlar

### Giriş
Ayrı seçenekler:
- Öğretmen Girişi
- Veli Girişi

Öğrenci girişi YOK.

### Öğretmen Paneli
Kartlar:
- öğrenci sayısı
- aktif görev
- katılım oranı
- toplam yem / başarı puanı
- son aktiviteler
- hızlı işlemler

Hızlı işlemler:
- öğrenci ekle
- görev oluştur
- akvaryumu aç
- raporları gör

### Öğrenci Yönetimi
- liste
- fotoğraf
- ad soyad
- sınıf
- balık
- seviye
- yem
- durum
- düzenle

### Öğrenci Profili
- büyük profil fotoğrafı
- balık
- seviye / XP barı
- tamamlanan görev
- yem
- rozet
- son başarılar
- gelişim geçmişi

### Görev Oluşturma
Alanlar:
- görev başlığı
- açıklama
- tür: ödev / okuma / davranış / katılım / proje / diğer
- XP ödülü
- yem ödülü
- son tarih
- tüm sınıfa ata / seçili öğrencilere ata

### Veli Paneli
- çocuk seçici (birden fazla çocuk varsa)
- profil fotoğrafı
- seviye
- son görevler
- tamamlanan / bekleyen görev
- rozetler
- başarı grafiği
- öğretmen mesajı/notu
- çocuğun balığı

### Raporlar
- katılım oranı
- görev tamamlanma
- haftalık aktivite
- en aktif öğrenciler
- görev türü dağılımı
- öğrenci bazlı filtre

## Teknik Yön

İlk prototip şu anda tek bir `index.html` dosyası olarak GitHub Pages üzerinde çalışıyor. Bu sadece demo.

Repo:
https://github.com/enescvsdg/sinifdenizi

Canlı demo:
https://enescvsdg.github.io/sinifdenizi/

Hedef mimari:
- Next.js
- React
- TypeScript
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage (öğrenci fotoğrafları)
- Row Level Security

Akvaryum için öneri:
- Phaser veya PixiJS veya Canvas tabanlı özel engine
- requestAnimationFrame
- boids / separation / wander davranışları
- spatial partitioning / grid ile 30-40 balıkta performans

## Veri Modeli Önerisi

### users
- id
- role: teacher | parent
- name
- email

### classes
- id
- teacher_id
- name
- grade
- decor_level
- class_xp

### students
- id
- class_id
- name
- photo_url
- student_number nullable
- fish_type
- fish_variant
- level
- xp
- feed

### parent_student_links
- parent_id
- student_id

### tasks
- id
- class_id
- teacher_id
- title
- description
- type
- xp_reward
- feed_reward
- due_date

### task_assignments
- id
- task_id
- student_id
- status
- completed_at
- approved_at

### badges
- id
- name
- icon
- rule

### student_badges
- student_id
- badge_id
- earned_at

### class_unlocks
- class_id
- unlock_key
- unlocked_at

### announcements
- id
- class_id
- teacher_id
- title
- body
- visible_to_parents

## Güvenlik / Çocuk Verisi

Öğrenci fotoğrafları herkese açık URL olarak servis edilmemeli.

Gerekli yaklaşım:
- private storage bucket
- signed URLs
- RLS
- öğretmen yalnızca kendi sınıflarını görür
- veli yalnızca bağlı olduğu öğrenciyi görür
- public akvaryum görünümünde profil fotoğrafı varsayılan olarak gösterilmemeli
- isim görünürlüğü ayarlanabilir olmalı

KVKK açısından veri minimizasyonu uygulanmalı.

## Mevcut Prototip Sorunları

Mevcut `index.html` hızlı demo niteliğinde ve production değildir.

Başlıca eksikler:
- tek dosya mimarisi
- localStorage
- gerçek auth yok
- gerçek veritabanı yok
- fotoğraf verisi browser local storage mantığında
- profesyonel asset pipeline yok
- akvaryum görsel kalitesi hedefin altında
- mobile UX sınırlı
- accessibility eksik
- test yok

## Codex'ten Beklenen İlk İş

Mevcut demoyu patch'lemeye devam etmek yerine projeyi gerçek uygulama mimarisine geçir.

Önerilen sıra:
1. Next.js + TypeScript scaffold
2. ortak design system
3. Supabase schema + migrations
4. auth: teacher + parent
5. teacher dashboard
6. student CRUD + photo upload
7. task CRUD / assignment
8. parent read-only portal
9. aquarium engine
10. collective success unlock system
11. reports
12. responsive polish
13. tests
14. deployment

## Ürün Kararları — Değiştirme

Aşağıdaki kararlar kullanıcı tarafından netleştirilmiştir:
- ürün adı SınıfDenizi
- slogan Öğren. Kazan. Büyüt.
- ayrı öğrenci hesabı yok
- veli hesabı var
- öğrenci fotoğrafı var
- balık çeşitliliği yüksek olmalı
- emoji balık kabul edilmiyor
- akvaryum geniş olmalı
- tam ekran akvaryum şart
- balıklar serbestçe yüzmeli
- çarpışma önleme olmalı
- isim etiketleri sürekli görünmemeli
- sınıfın toplu başarısı dekorasyonları açmalı
- bireysel başarı balığı geliştirmeli
- öğretmen paneli + veli paneli birlikte olmalı

## Çalışma Tarzı

Kullanıcı her küçük adımda onay vermek istemiyor.

Tercih:
- Codex mümkün olduğunca otonom ilerlesin
- tasarım/teknik kararları mantıklı varsayımlarla tamamlasın
- bitmiş veya anlamlı bir milestone sunduktan sonra revizyon alınsın
- her küçük değişiklik için soru sorulmasın

## Kalite Çıtası

Hedef "çalışıyor" seviyesi değil, profesyonel demo / yatırımcıya veya okula gösterilebilir kalite.

Özellikle akvaryum ana vitrin özelliğidir ve görsel olarak güçlü olmalıdır.
