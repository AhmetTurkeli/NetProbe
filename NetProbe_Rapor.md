# NetProbe - Ağ Güvenliği Tarama Uygulaması Projesi Raporu

## 1. Proje Özeti

NetProbe, uzak sistemlerin işletim sistemlerini tespit etmek, açık portlarını bulmak ve bu portlarda çalışan servisleri belirlemek için geliştirilmiş web tabanlı bir ağ güvenliği tarama uygulamasıdır. Uygulama, modern web teknolojileri ve güçlü tarama kütüphaneleri kullanılarak geliştirilmiştir.

## 2. Teknik Özellikler

### 2.1 Kullanılan Teknolojiler

**Backend:**
- Python 3.x+
- Flask (Web Framework)
- Flask-SocketIO (WebSocket desteği)
- Python-nmap (Nmap entegrasyonu)
- Eventlet (Asenkron işlemler için)

**Frontend:**
- HTML5
- CSS3
- JavaScript (ES6+)
- WebSockets (Gerçek zamanlı iletişim)

### 2.2 Mimari Yapı

Uygulama, istemci-sunucu mimarisi üzerine inşa edilmiştir:

1. **Sunucu Bileşenleri:**
   - Flask Web Sunucusu: HTTP isteklerini yönetir
   - SocketIO: Gerçek zamanlı bağlantılar sağlar
   - Nmap Entegrasyonu: Ağ taraması işlevselliği sağlar

2. **İstemci Bileşenleri:**
   - Responsive Web Arayüzü: Tüm cihazlarda uyumlu görünüm
   - WebSocket İstemcisi: Sunucu ile gerçek zamanlı iletişim
   - Dinamik Sonuç Tablosu: Tarama sonuçlarını görselleştirir

### 2.3 Dosya Yapısı

```
NetProbe/
│
├── app.py                 # Ana uygulama dosyası
├── requirements.txt       # Bağımlılıklar
│
├── static/                # Statik dosyalar
│   ├── css/
│   │   └── style.css      # CSS stil dosyası
│   │
│   └── js/
│       └── main.js        # İstemci JavaScript kodları
│
└── templates/
    └── index.html         # Ana HTML şablonu
```

## 3. Fonksiyonel Özellikler

### 3.1 Kullanıcı Arayüzü

- **Bağlantı Durumu Göstergesi:** Kullanıcıya WebSocket bağlantı durumunu gösterir
- **IP Adresi Giriş Formu:** IP doğrulama ile kullanıcı girdilerini kontrol eder
- **Tarama Başlatma:** Tek tıkla tarama başlatma
- **Yükleniyor Göstergesi:** Tarama süresince aktivite göstergesi
- **Sonuç Gösterimi:** Tarama tamamlandığında sonuçları düzenli bir şekilde sunar

### 3.2 Tarama Özellikleri

- **İşletim Sistemi Tespiti:** Hedef sistemin işletim sistemi bilgisini tespit eder
- **Port Tarama:** Açık portları belirler
- **Servis Tespiti:** Açık portlarda çalışan servisleri ve sürümlerini tespit eder
- **Hata Yakalama:** Tarama sırasında oluşabilecek hataları yönetir ve kullanıcıya bildirir

## 4. Performans ve Güvenlik

### 4.1 Performans Özellikleri

- **Asenkron İşlemler:** Tarama işlemleri sunucu tarafında asenkron olarak gerçekleştirilir
- **WebSocket Kullanımı:** Gerçek zamanlı veri akışı sağlanır, böylece sayfa yenileme gerekmez
- **Hızlı Arayüz Yanıtı:** Kullanıcı arayüzü tarama sırasında bile etkileşimli kalır

### 4.2 Güvenlik Önlemleri

- **Girdi Doğrulama:** Kullanıcı girdileri hem istemci hem sunucu tarafında doğrulanır
- **Hata İşleme:** Tüm istisnalar yakalanır ve uygun şekilde işlenir
- **CORS Yapılandırması:** Güvenli çapraz kaynak istekleri yönetimi

## 5. Kurulum ve Kullanım

### 5.1 Sistem Gereksinimleri

- Python 3.x+ yüklü bir işletim sistemi
- Nmap tarama aracı (sistem üzerinde yüklü olmalı)
- 5000 numaralı port erişilebilir olmalı

### 5.2 Kurulum Adımları

1. Gerekli Python paketlerinin yüklenmesi:
   ```
   pip install -r requirements.txt
   ```

2. Nmap'in kurulması:
   - Windows: Nmap indirme sayfasından kurulum yapılır
   - Linux: `sudo apt install nmap` komutu kullanılır
   - macOS: `brew install nmap` komutu kullanılır

### 5.3 Kullanım Talimatları

1. Uygulamayı başlatmak için:
   ```
   python app.py
   ```

2. Web tarayıcısında `http://localhost:5000` adresine erişim

3. Taranacak IP adresini girin ve "Taramaya Başla" düğmesini tıklayın

4. Tarama tamamlandığında sonuçları görüntüleyin

## 6. Test Sonuçları

### 6.1 Fonksiyonel Testler

| Test Senaryosu | Beklenen Sonuç | Gerçek Sonuç |
|----------------|----------------|--------------|
| WebSocket Bağlantısı | Bağlantı durumu gösterilmeli | Başarılı |
| Geçersiz IP Girişi | Hata mesajı gösterilmeli | Başarılı |
| Geçerli IP Taraması | Tarama sonuçları gösterilmeli | Başarılı |
| Bağlantı Kesilmesi | Bağlantı durumu güncellenmel | Başarılı |

### 6.2 Performans Testler

- **Tarama Süresi:** Ortalama tarama süresi, hedef sistemin yanıt süresi ve taranacak port sayısına bağlıdır
- **Bellek Kullanımı:** Uygulama normal kullanımda minimal bellek kullanımı göstermektedir
- **CPU Kullanımı:** Tarama sırasında kısa süreli CPU kullanımı artabilir

## 7. Kısıtlamalar ve Bilinen Sorunlar

- Nmap aracının sistem üzerinde kurulu olmaması durumunda tarama yapılamaz
- Çok yüksek sayıda portun taranması zaman alabilir
- Bazı işletim sistemi tespitleri, hedef sistemin yapılandırmasına bağlı olarak doğru çalışmayabilir
- Yönetici izinleri olmadan bazı tarama türleri (örn. SYN taraması) kullanılamayabilir

## 8. Gelecek Geliştirmeler

- Tarama sonuçlarını PDF veya CSV olarak dışa aktarma özelliği
- Çoklu IP adresi veya IP aralığı tarama desteği
- Planlı ve periyodik tarama özellikleri
- Çoklu kullanıcı desteği ve tarama geçmişi
- Daha detaylı güvenlik açığı tespiti
- Özel tarama profilleri oluşturma özelliği

## 9. Sonuç

NetProbe, modern web teknolojileri ve güçlü tarama yetenekleri ile ağ güvenliği taraması yapmak için kullanışlı bir araçtır. Kullanıcı dostu arayüzü ve gerçek zamanlı sonuç gösterimi sayesinde sistem yöneticileri ve güvenlik uzmanları için değerli bir araç olarak hizmet verebilir.

Bu proje, ağ güvenliği değerlendirmeleri için temel bir başlangıç noktası olarak tasarlanmıştır ve yukarıda belirtilen gelecek geliştirmelerle daha da güçlendirilebilir.

---

**Not:** Bu uygulama, yalnızca yasal izinleriniz olan sistemler üzerinde kullanılmalıdır. İzinsiz taramalar yasal sonuçlara yol açabilir. 