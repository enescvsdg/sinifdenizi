# SınıfDenizi — Özgün Deniz Canlıları Tasarım Brifi

Bu belge, `lib/species.ts` içindeki 30 sabit tür kimliğinin özgün karakter tasarım hedeflerini ve görsel teslim durumunu tanımlar. Tür kimlikleri mevcut öğrenci kayıtlarıyla uyum için korunur. Aşağıdaki anatomi, renk ve hareket açıklamaları tasarım hedefleridir; her detayın tek tek uygulanmış olduğuna ilişkin bir doğrulama raporu değildir.

## Güncel teslim durumu

30 türün tamamı için özgün, tek pozlu çizimler üretildi. Beş atlasın her biri gerçek 1.536 × 1.024 piksel boyutunda RGBA PNG'dir; 3 × 2 düzende altı adet 512 × 512 piksel hücre içerir. Bu teslim, aşağıdaki tercih edilen 3.072 × 2.048 piksel üretim hedefinden daha küçük boyuttadır.

| Dosya | Atlas grubu | Tür ID'leri | Gerçek boyut |
| --- | --- | --- | --- |
| `public/assets/creatures-original-01.png` | A | 0–5 | 1.536 × 1.024 px |
| `public/assets/creatures-original-02.png` | B | 6–11 | 1.536 × 1.024 px |
| `public/assets/creatures-original-03.png` | C | 12–17 | 1.536 × 1.024 px |
| `public/assets/creatures-original-04.png` | D | 18–23 | 1.536 × 1.024 px |
| `public/assets/creatures-original-05.png` | E | 24–29 | 1.536 × 1.024 px |

Katalogda 27 temel tür ile üç XP ödül türü bulunur. 27, 28 ve 29 numaralı türler sırasıyla öğrencinin 500, 1.500 ve 3.000 XP kazanmasıyla seçilebilir; bunların görselleri de hazırdır. Yeni örnek sınıf 24 farklı temel tür kullanır. Mevcut sınıf kayıtlarının tür ID'leri ve öğrenci seçimleri korunur.

Mevcut akvaryumda türe göre gövde rotaları ve CSS salınımları vardır; yüzey ışığı, su yansımaları, mercan/yosun hareketleri ve dekoratif ortam sürüleri korunur. **Ayrı yüzgeç, kuyruk, kol veya dokunaç iskelet animasyonları ve kare kare uzuv döngüleri henüz uygulanmadı.** Aşağıdaki ayrıntılı uzuv hareketleri ve animasyon teslimleri sonraki aşamanın hedefleridir. Üretimde kullanılan gerçek promptlar ve yöntem `ASSET_NOTES.md` dosyasında tutulur.

## Görsel amaç

SınıfDenizi akvaryumu, her biri uzaktan tanınabilen, canlı ve sevimli deniz arkadaşlarıyla dolu hissettirmeli. Referanslardaki hacim, renk zenginliği, temiz siluet ve özenli yüzey kalitesi hedeflenir. Film veya oyun karakterlerinin yüzleri, beden oranları, desen yerleşimleri ve karaktere özgü aksesuarları alınmaz. Her tür, kendi anatomisinden yola çıkılarak yeniden tasarlanır.

- Hacimli 2D illüstrasyon ile yumuşak 3D görünümü birleştir: okunaklı ana kütleler, dolgun geçişler, ince yüzey dokusu ve sınırlı parlaklık. Plastik oyuncak kadar sert parlama kullanma.
- Sevimlilik için orta boy, birbirinden farklı göz yapıları kullan. Göz, karakterin başının tamamını kaplamasın; köpekbalıkları ve orfozun gözleri küçük, denizatınınki daha belirgin olabilir. İnsan dişleri, aşırı uzun kirpikler ve insan yüzü taklitlerinden kaçın.
- Her canlının kişiliğini ağız köşesi, bakış yönü, yüzgeç duruşu ve beden eğrisiyle ifade et. Hepsine aynı gülümsemeyi ekleme.
- Türün doğal anatomisini okunur tut. Fantastik renkler sadece belirtilen özel türlerde baskın olsun. Deniz yıldızına yüzgeç, mürekkep balığına balık kuyruğu ekleme.
- Kuyruk, yüzgeç, kol ve dokunaçlar gövdeye doğru yerlerden bağlansın. Siluetler farklı olsun; aynı temel balığın rengini değiştirerek yeni tür üretme.
- Ana ışık yukarı soldan, yumuşak turkuaz çevre ışığı aşağı sağdan gelsin. Işık ve renk, tüm atlaslarda aynı dünyaya ait görünmeli.
- 80–120 piksel genişliğinde de tür ayrımı okunmalı. Önemli işaretler birkaç net renk alanı olsun; ince desenler yakından bakıldığında zenginlik katsın.
- Parçacık, kabarcık, mercan, yazı, kullanıcı rozeti ve arka planı canlı görseline gömme. Akvaryum ışık yansımaları ve çevre hareketleri ayrı katmanlarda uygulanır.

## Tür karakterleri ve hareketleri

Hareket süreleri ve uzuv davranışları gelecek animasyon aşaması için görsel ritim önerileridir; mevcut tek pozlu çizimlerin bağımsız yüzgeç, kuyruk veya kol hareketi yaptığı anlamına gelmez. Canlının mevcut ilerleme hızı ve rotası türüne, büyüklüğüne ve akvaryumdaki katmanına göre ayarlanır. Hedef, kısa süzülmeler ve yön değişimleriyle çeşitlenen doğal harekettir.

| ID | Tür | Özgün siluet, renk ve ifade | Yüzüş / hareket dili |
| --- | --- | --- | --- |
| 0 | Palyaço balığı | Kısa oval gövde, yuvarlak burun, geniş fakat ölçülü kuyruk. Kayısı-turuncu sırt, koyu bakır yüzgeç uçları, anatomik konumlarda üç fildişi bant; ortadaki bant hafif dalgalı kenarlı. Küçük kehribar iris, meraklı ve sakin bakış. Yüzgeçler dengeli büyüklükte. | Küçük göğüs yüzgeçleri sırayla çalışır; 0,8–1,1 saniyelik kuyruk salınımı, ardından kısa süzülme. Dönüşten önce baş hafifçe yönelir. |
| 1 | Mavi tang | Yuvarlak, yandan basık gövde; kobalt ve turkuaz geçişi. Türü tanıtan koyu sırt/yan çizgisi doğal anatomiyi izler; sarı kuyruk daha dar, yüz farklı ve göz küçük badem biçiminde. Yan yüzde hafif gümüş benekler. | Göğüs yüzgeçleriyle kıvrak yön düzeltmeleri, kısa hızlanmalar; gövde hafif yatarken kuyruk daha hızlı çalışır. |
| 2 | Sarı tang | Disk biçimli altın-sarı gövde, öne uzanan küçük ağız, tepede kesintisiz yüksek sırt yüzgeci. Limon sarısı merkez, bal tonlu yüzgeç ışınları; zeytin-kahve göz. | Yumuşak, kesintisiz kuyruk ritmi ve küçük yan yüzgeç titreşimleri. Geniş, sakin dönüşler. |
| 3 | Kelebek balığı | Yassı, yüksek gövde ve ince uzun ağız. Krem gövde üzerinde lacivert çapraz çizgiler, mercan sarısı kenarlar, kuyruğa yakın tek yumuşak koyu benek. Meraklı ileri bakış. | Kısa mesafe süzülür, sonra göğüs yüzgeçleriyle konumunu tutar. Hızlı kaçış yerine küçük ve dikkatli yön değişimleri. |
| 4 | Aslan balığı | Yetişkin ve geniş gövdeli; ayrı ayrı okunur uzun sırt dikenleri ve yelpaze göğüs yüzgeçleri. Kiremit, krem ve mürdüm çizgiler; çizgiler yüzgeç ışınlarına devam eder. Küçük göz, sakin ifade. | 1,8–2,4 saniyelik geniş göğüs yüzgeci açılıp kapanması. Dikenler bükülmek yerine çok hafif salınır; görkemli ve yavaş ilerler. |
| 5 | Dikenli balon balığı | Tam küre yerine armut biçimli yuvarlak gövde, minik kuyruk. Kum-bej üst gövde, krem karın ve seyrek tarçın benekler; kısa konik dikenler gövdeden düzgün çıkar. Küçük gülümseme, birbirinden uzak gözler. | Çabuk küçük göğüs yüzgeci vuruşlarıyla yavaş ilerler; çok hafif yukarı-aşağı süzülür. Şişme varsa kısa ödül tepkisi olarak kullanılır. |
| 6 | Denizatı | İnce uzun boyun, küçük boru ağız, belirgin kemiksi halkalar ve içe kıvrık kuyruk. Pas turuncusu ile soluk mercan rengi, üç ince turkuaz sırt çıkıntısı. Büyük olmayan yuvarlak göz ve dikkatli bakış. | Dikey durur; küçük sırt yüzgeci hızlı titreşirken beden 2–3 saniyede hafif salınır. Kuyruk kıvrımı çok az açılıp kapanır. |
| 7 | Manta vatoz | Geniş elmas biçimli kanatlar, önde iki doğal baş yüzgeci, ince uzun kuyruk. Petrol mavisi üst yüzey, inci grisi alt yüz; kanat uçlarında birkaç soluk camgöbeği nokta. Gözler başın yanlarında, ağız önden okunur. | Kanatlar 2–3 saniyede dalga gibi iner ve kalkar. Kuyruk hareketi gövdeyi izler; dönüşte bütün gövde yumuşakça yatar. |
| 8 | Deniz kaplumbağası | Basık oval kabuk, doğal kürek biçimli ön yüzgeçler. Yosun yeşili deri, bakır-kahve kabuk plakaları, plakaları ayıran açık krem ince çizgiler. Kısa yuvarlak burun, koyu yeşil orta boy gözler. | Ön yüzgeçler 2–3 saniyelik güçlü vuruşla çalışır, ardından uzun süzülme. Arka yüzgeçler küçük dümen hareketleri yapar. |
| 9 | Beyaz uçlu köpekbalığı | İnce resif köpekbalığı gövdesi; künt kısa burun, sırt ve üst kuyruk ucunda belirgin beyaz alanlar. Arduvaz-mavi üst ve soluk gri alt gövde. Küçük sakin gözler, kapalı ağız; insan dişleri yok. | Kuyruğa doğru artan 1,5–2 saniyelik yan dalga. Göğüs yüzgeçleri sabitçe süzülür; sürekli ileri hareket ve geniş dönüşler. |
| 10 | Ahtapot | Küçük oval manto ve sekiz ayrı, okunur kol; kolların hepsi aynı kıvrımda değil. Kestane-kırmızıdan şeftaliye geçiş, alt yüzde krem vantuzlar. İki ölçülü göz, hafif eğik meraklı duruş. | Kollar gecikmeli dalgalarla açılır; kısa ileri hareket sırasında toplanır. Tek parça balık kuyruğu gibi sallanmaz. |
| 11 | Denizanası | Yuvarlak, yarı saydam cam çan; içinde ince ışınsal yapı. Lavanta kenar, süt mavisi merkez ve soluk pembe dokunaçlar; yüz eklenmez. Dokunaç uzunlukları küçük farklılıklar gösterir. | Çan 1,8–2,6 saniyede sıkışıp açılır; yükselme çanın sıkışmasıyla eşleşir. Dokunaçlar gecikmeli sürüklenir. |
| 12 | Melek balığı | Yüksek üçgen sırt/anal yüzgeçleriyle belirgin dikey siluet. Sedef gümüş gövde, üç koyu grafit dikey şerit, altın sırt kenarı ve iki ince karın uzantısı. Küçük mavi-gri göz. | Yavaş ve zarif; uzun alt uzantılar akıntıda geriden gelir. Dönüşlerde dik gövdenin çok hafif yatışı görülür. |
| 13 | Çekiçbaş köpekbalığı | Baş iki yana açık T biçiminde; iki uçtaki gözler üç çeyrek bakışta okunur. Duman grisi gövde, açık karın, sırt boyunca yumuşak bronz parıltı. Uzun ince kuyruk ve doğal yüzgeçler. | Baş sakin kalırken arkaya doğru artan kuyruk salınımı. Geniş S rotaları, güçlü fakat telaşsız ilerleme. |
| 14 | Balina köpekbalığı | Büyük, geniş ve düz baş; uzun kalın gövde. Gece mavisi sırt üstünde düzenli fakat kusursuz simetrik olmayan açık benek/çizgi deseni, inci gri karın. Çok küçük gözler, doğal geniş ağız. | En ağır ve sakin ritim: 3–4 saniyelik geniş kuyruk salınımı. Uzak katmanda uzun süzülür, ani dönüş yapmaz. |
| 15 | Orfoz | Tıknaz gövde, büyük fakat dostça yuvarlatılmış ağız, kesintisiz alçak sırt yüzgeci. Zeytin-teal üzerinde bakır benekler, soluk krem alt çene. Küçük amber göz, dingin ifade. | Kuyruk kısa güçlü vuruşlar yapar; aralarda asılı kalır. Göğüs yüzgeçleri beden ağırlığını dengeler gibi yavaş açılır. |
| 16 | Papağan balığı | Kalın oval gövde, türü tanıtan küçük gaga biçimli ağız ve belirgin büyük pul alanları. Turkuaz ön gövde, mercan-pembe yan alan, yeşil kuyruk kökü; renk sınırları pulları izler. | Göğüs yüzgeçleriyle kürek çeker gibi ilerler. Hafif burun aşağı keşif pozları; ağız abartılı konuşma hareketi yapmaz. |
| 17 | Mürekkep balığı | Kalem biçimli uzun manto, arkada iki üçgen yüzgeç; önde sekiz kısa kol ve iki daha uzun beslenme kolu. Sedef leylak yüzey ve ince pas rengi noktalar. İki küçük dikkatli göz. | Üçgen yüzgeçler ince dalgalar yapar; kısa jet hareketinde kollar toparlanır. Ahtapottan daha uzamış ve yönlü ilerler. |
| 18 | Mandarin balığı | Kısa gövde, iri yelpaze göğüs yüzgeçleri ve yüksek küçük sırt yüzgeci. Koyu petrol zemin üzerinde bakır ve turkuaz dolambaçlı doğal çizgiler; göz çevresinde ince altın halka. | Zemine yakın küçük mesafelerde gezinir, sık durur. İki göğüs yüzgeci farklı zamanlarda açılarak yön verir. |
| 19 | Deniz yıldızı | Beş küt, hafif farklı eğimde kol; kabarık orta disk ve küçük gözenek dokusu. Mercan turuncusu merkez, şeftali kol uçları, seyrek krem benekler. Yüz eklenmez; karakter duruşuyla kurulur. | Zemine yakın çok yavaş yer değiştirir. Kollar uçtan hafif esner; açık suda balık gibi yüzmez. |
| 20 | Kılıç balığı | İnce uzun gövde, belirgin fakat kadraja sığan yassı kılıç burun, yüksek ilk sırt yüzgeci ve hilal kuyruk. Mürekkep mavisi sırt, gümüş yanlar, morumsu ince ışık çizgisi. Küçük odaklı göz. | Kuyruk hızlı ama düşük genlikte çalışır; uzun düz süzülmeler. Dönüşleri diğer küçük türlerden daha geniştir. |
| 21 | Barakuda | Kılıç balığından daha uzun çene ve silindirik gövde; iki ayrı küçük sırt yüzgeci. Gümüş-gri yan yüzey, koyu yeşil sırt ve kısa dikey koyu çizgiler. Kapalı ağız, küçük açık renk iris. | Kısa seri hızlanma, ardından uzun sakin süzülme. Ani hareketleri seyrek; sınıf sahnesini telaşlandırmaz. |
| 22 | Mavi cerrah | ID 1'den farklı daha uzun oval gövde, belirgin küçük burun ve hilal kuyruk. Tek parça koyu ultramarin yüzey, ince buz mavisi yüzgeç kenarları ve kuyruk kökünde küçük altın cerrah dikeni. Siyah büyük yan leke yok. | Sürekli ve dengeli kuyruk ritmi; geniş kavisler. ID 1'in kısa kıvrak dönüşlerine göre daha kararlı ilerler. |
| 23 | Kutup balığı | Yuvarlak alınlı, kısa torpido gövdeli fantastik soğuk su balığı. İnci beyazı pul yüzeyi, buz mavisi yarı saydam yüzgeçler ve birkaç gri-mavi sırt beneği. Orta boy koyu çelik göz. | Ağır ve yumuşak kuyruk vuruşları; yüzgeçler saydam kumaş gibi küçükçe bükülür. Buz parçaları veya kar efekti görsele gömülmez. |
| 24 | Taş balığı | Yassı, topaklı gövde, pütürlü sırt ve geniş yelpaze göğüs yüzgeçleri. Kum-kahve, yosun yeşili ve seyrek soluk pembe alanlar; küçük gözler yukarı bakar. İfade sakin, grotesk değil. | Zemine yakın kalır, küçük konum düzeltmeleri yapar. Göğüs yüzgeçleri hafifçe açılıp kapanır; sürekli orta suda dolaşmaz. |
| 25 | Aslan yavrusu | ID 4'ün küçültülmüş kopyası değil: daha kısa gövde, kısa sırt dikenleri, daha yuvarlak yelpaze yüzgeçleri. Şeftali-turuncu zemin, az sayıda geniş krem çizgi ve yüzgeçlerde soluk bakır noktalar. Gövdeye oranla biraz daha belirgin göz. | Kısa meraklı yüzüşler ve küçük duraklamalar; yetişkinden daha hızlı yüzgeç ritmi. Dikenler yaprak gibi aşırı kıvrılmaz. |
| 26 | Renkli sürüler | Tek öğrenci seçeneği olarak 5–7 küçük özgün resif balığından oluşan bileşik siluet. Balıklar farklı yön açılarında, ancak birlikte sağa ilerler; sarı, turkuaz, mercan ve mavi palet dengeli kullanılır. Büyük tek lider veya aşırı küçük detay yok. | Grup merkezine bağlı birlikte ilerleme; üyeler küçük gecikmelerle yön değiştirir. Öğrenciye ait sürü ile dekoratif ortam sürüleri ayrı tutulur. Tek atlas görseli kullanılırsa sürü içi hareket iddia edilmez. |
| 27 | Özel (Altın balık) | Kısa elmas biçimli tropik gövde, üç loplu akıcı kuyruk ve yüksek yelken sırt yüzgeci. Metalik altın değil, amber-sarı sedef katmanları; yüzgeç kenarında krem ışık. Yuvarlak kahverengi göz, özgüvenli sakin ifade. | 1,4–2 saniyelik yumuşak vuruş, uzayan kuyrukta gecikme. Nadir ve kısa parlama ayrı efekt olabilir; sürekli ışık patlaması yok. 500 öğrenci XP'sinde açılır. |
| 28 | Efsane (Gökkuşağı) | İnce oval gövde, tül gibi iki katlı kuyruk ve yaprak biçimli sırt yüzgeci. Turkuazdan mercana ve mora geçen sedef renk alanları; tüm gövdeye dümdüz gökkuşağı şeritleri uygulanmaz. Küçük bakır iris, zarif ifade. | Yavaşça yükselip süzülen rota; uzun yüzgeçlerde aşamalı dalga. Renk değişimi çok hafif ve yavaştır. 1.500 öğrenci XP'sinde açılır. |
| 29 | Efsane (Karanlık) | Derin, yuvarlak gövde; arkaya taranan farklı uzunluktaki yüzgeç ışınları ve kısa çatal kuyruk. Lacivert, mor ve petrol tonları; yan yüzde seyrek küçük camgöbeği ışık noktaları. Orta boy açık mavi göz, ürkütmeyen sakin bakış. | Sessiz uzun süzülmeler, 2–3 saniyelik ağır kuyruk ritmi; yüzgeç uçları geriden gelir. Işık noktaları yavaş solur/parlar, yanıp sönmez. 3.000 öğrenci XP'sinde açılır. |

## 3 × 2 atlas üretim grupları

Her atlas altı eşit hücreden oluşur. Aşağıdaki sıralama soldan sağa, önce üst sıra sonra alt sıra şeklindedir. Atlas sırası arayüzdeki katalog sırasından farklıdır; eşleştirme daima sayısal ID ile yapılır.

| Atlas | Üst sol | Üst orta | Üst sağ | Alt sol | Alt orta | Alt sağ |
| --- | --- | --- | --- | --- | --- | --- |
| A — Resif balıkları | 0 · Palyaço balığı | 1 · Mavi tang | 2 · Sarı tang | 3 · Kelebek balığı | 4 · Aslan balığı | 5 · Dikenli balon balığı |
| B — Temel özel canlılar | 6 · Denizatı | 7 · Manta vatoz | 8 · Deniz kaplumbağası | 9 · Beyaz uçlu köpekbalığı | 10 · Ahtapot | 11 · Denizanası |
| C — Yeni keşifler | 12 · Melek balığı | 13 · Çekiçbaş köpekbalığı | 14 · Balina köpekbalığı | 15 · Orfoz | 16 · Papağan balığı | 17 · Mürekkep balığı |
| D — Derinlik ve biçim | 18 · Mandarin balığı | 19 · Deniz yıldızı | 20 · Kılıç balığı | 21 · Barakuda | 22 · Mavi cerrah | 23 · Kutup balığı |
| E — Sürüler ve ödüller | 24 · Taş balığı | 25 · Aslan yavrusu | 26 · Renkli sürüler | 27 · Özel (Altın balık) | 28 · Efsane (Gökkuşağı) | 29 · Efsane (Karanlık) |

### Atlas teslim kuralları

1. Her atlası tercihen 3.072 × 2.048 piksel, 1.024 × 1.024 piksel eşit hücrelerle üret. Araç farklı boyut veriyorsa aynı 3:2 oranı ve eşit hücreleri koru, gerçek ölçüleri teslim notuna yaz.
2. Hücre başına yalnız ilgili canlı olsun. 26 numaralı türün bütün sürüsü tek hücreye sığar; diğer hücrelere taşmaz. Diğer türlerin yanına dekoratif küçük balıklar eklenmez.
3. Gövde merkezini hücre merkezine yakın yerleştir. Canlı, uzun eksende hücrenin yaklaşık %76–84'ünü doldursun. Uzun kılıç, diken, kanat veya dokunaç dahil her yönde en az %8 boşluk bırak.
4. Balıklar sağa dönük, hafif üç çeyrek yan görünümde olsun. Yüzün bir tarafı baskın okunmalı; karşı tarafın gözü zorla gösterilmemeli. Denizatı dikey, yıldız üstten hafif açılı; manta ve kaplumbağada doğal kanat/kabuk okunurluğu için üç çeyrek açı kullanılabilir.
5. Şeffaf PNG hedefle. Şeffaflık mümkün değilse bunu açıkça belirt; beyaz/kareli arka planı şeffafmış gibi teslim etme. Sahneye uygun düzgün alfa kenarı kabul kontrolünün parçasıdır.
6. Atlas üzerine isim, sayı, çizgi, hücre çerçevesi, watermark veya rozet ekleme. Tür ID'si ve hücre koordinatlarını görsel dışındaki teslim notunda tut.
7. Hücreye kesilmiş kuyruk, komşu hücreden gelen yüzgeç, gövdeye yapışan yabancı parça veya birleşmiş iki canlı kabul edilmez. Tek canlı yeniden üretilecekse bütün atlasa istemeden stil farkı taşımamasına dikkat et.
8. İlk atlas kabul edildikten sonra diğer atlaslarda aynı kamera, ışık, doku ve göz ölçeğini sürdür. Farklı tür anatomileri korunur; tüm gözler ve ağızlar tek şablona zorlanmaz.

## Henüz uygulanmamış animasyon teslimleri

Tamamlanan beş atlas tek pozlu çizimlerden oluşur. Şu anda canlıların bütün bedenleri akvaryum içinde türe göre ilerler ve CSS salınımları uygulanır. Yüzgeçler, kuyruklar, kollar ve dokunaçlar ayrı bir iskelet ya da animasyon karesiyle hareket etmez. Aşağıdaki işler henüz yapılmadı; gerçek uzuv hareketi için ek görsel ve animasyon teslimi gerekir.

- İkinci aşamada türe uygun 6–8 karelik döngü veya gövde, kuyruk, yüzgeç/kol parçaları ayrı katmanlar halinde hazırlanır. Her karede bedenin ölçüsü, renk deseni ve ışığı sabit kalır.
- Denizanası çanı, ahtapot kolları, manta kanatları ve kaplumbağa yüzgeçleri kendi anatomilerine göre hareket eder. Tek bir kuyruk sallama animasyonu bütün türlere uygulanmaz.
- Kıyı tabanındaki deniz yıldızı ve taş balığı için düşük genlikli yerinde hareket tercih edilir. Türün doğal davranışı, sahnedeki hareketlilik isteğinden önce gelir.
- Sürü içi bireysel yüzüş için 26 numaralı grubun küçük üyeleri ek olarak ayrı parçalarda teslim edilir. Bu ayrıştırma yapılmadan sabit sürü görseline bağımsız üye animasyonu varmış gibi davranılmaz.
- Hareket azaltma tercihinde yüzgeç döngüleri, parlamalar ve hızlı yer değiştirmeler azaltılır; canlılar tanınır ve seçilebilir kalır.

## Kabul kontrolü

- 30 ID'nin her biri kendi türünün özgün, tamamlanmış görseline bağlı mı? Eksik bir türün yerine başka balık gösterilmiyor mu?
- 1 ile 22, 4 ile 25, 10 ile 17 ve 20 ile 21 küçük boyutta bile ayırt ediliyor mu?
- Göz ve yüz oranları canlıya özgü mü; görsel bilinen bir film karakterinin yüzünü veya özgün biçimini tekrar ediyor mu?
- Anatomik uzuv sayısı, birleşim yerleri ve şeffaf kenarlar yakın görünümde doğru mu?
- Küçük kartta, orta boy akvaryumda ve tam ekranda siluet anlaşılır mı?
- 25–40 öğrenci olduğunda ışık, parlama ve renk çeşitliliği birbirini bastırmadan okunuyor mu?
- Hazır olmayan varlıklar açıkça hazırlanıyor durumunda mı? Yeni tür ancak gerçek görseli doğrulandığında seçilebilir hale geliyor mu?
- 27, 28 ve 29 numaralı ödüller için kilit koşulları öğrencinin kendi XP'siyle korunuyor mu?

30 türün statik görsel üretimi tamamlandı; dosyalar, gerçek boyutlar ve atlas ID grupları yukarıda kayıtlıdır. Ayrıntılı uzuv animasyonu üretimi henüz tamamlanmadı. Kabul kontrolü her görsel ve animasyon güncellemesinde yeniden uygulanır; bir brif maddesinin burada yer alması tek başına o davranışın uygulamada bulunduğu anlamına gelmez.

Çekiçbaş köpekbalığı (ID 13), baş biçimini belirginleştirmek için ayrıca üretilen `public/assets/creature-hammerhead-original.png` dosyasını kullanır (1536 × 1024, RGBA). Üçüncü atlasın ilk çizimi dosyada korunur ancak bu türün görünümünde kullanılmaz.
