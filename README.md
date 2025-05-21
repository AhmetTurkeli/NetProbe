# NetProbe - Ağ Güvenlik Tarama Aracı

NetProbe, uzak makinelerin işletim sistemini, açık portlarını ve bu portlarda çalışan servisleri tespit eden bir web tabanlı ağ güvenlik tarama aracıdır.

## Özellikler

- Web tabanlı kullanıcı dostu arayüz
- WebSocket ile gerçek zamanlı bağlantı
- Uzak makinelerin işletim sistemi tespiti
- Açık portların ve servislerin taranması
- Tarama sonuçlarının JSON formatında alınması

## Gereksinimler

- Python 3.x+
- Nmap (Python-nmap kütüphanesi için gerekli)

## Kurulum

1. Bu repoyu klonlayın:
    ```
    git clone https://github.com/username/netprobe.git
    cd netprobe
    ```

2. Gerekli Python paketlerini yükleyin:
    ```
    pip install -r requirements.txt
    ```

3. Nmap'i yükleyin:
   - Windows: [Nmap indirme sayfası](https://nmap.org/download.html)
   - Linux: `sudo apt-get install nmap` (Debian/Ubuntu)
   - macOS: `brew install nmap` (HomeBrew kullanarak)

## Kullanım

1. Uygulamayı başlatın:
    ```
    python app.py
    ```

2. Web tarayıcınızda `http://localhost:5000` adresine gidin.

3. Taramak istediğiniz IP adresini girin ve "Taramaya Başla" butonuna tıklayın.

4. Tarama tamamlandığında, sonuçlar arayüzde gösterilecektir.

## Güvenlik Uyarısı

Bu uygulama, ağ taraması yapmak için tasarlanmıştır. Lütfen tarama yapmadan önce hedef ağın sahibinden izin aldığınızdan emin olun. İzinsiz taramalar, bazı bölgelerde yasal sonuçlar doğurabilir.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın. 