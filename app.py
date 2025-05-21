from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
import nmap
import json
import socket
import logging
import eventlet
import re

# Monkey patching for eventlet
eventlet.monkey_patch()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'netprobesecret'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='netprobe.log',  # Log dosyası adı
    filemode='a'  # Append modu (mevcut dosyaya ekler)
)
logger = logging.getLogger(__name__)

# IP doğrulama için regex
def is_valid_ip(ip):
    pattern = r'^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
    return bool(re.match(pattern, ip))

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    logger.info("Client connected")
    socketio.emit('connection_status', {'status': 'connected', 'message': 'Sunucuya bağlanıldı'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info("Client disconnected")

@socketio.on('scan_request')
def handle_scan_request(data):
    ip_address = data.get('ip_address', '')
    
    # IP adresini logla
    logger.info(f"Tarama istegi: IP={ip_address}")
    
    # Boş IP adresi kontrolü
    if not ip_address:
        error_msg = "Geçerli bir IP adresi giriniz (boş değer)"
        logger.warning(f"Gecersiz tarama istegi: {error_msg}")
        socketio.emit('scan_error', {'message': error_msg})
        return
    
    # IP formatı kontrolü
    if not is_valid_ip(ip_address):
        error_msg = f"Geçersiz IP format: {ip_address}"
        logger.warning(f"Gecersiz tarama istegi: {error_msg}")
        socketio.emit('scan_error', {'message': 'Geçerli bir IP adresi giriniz'})
        return
    
    try:
        scan_results = perform_scan(ip_address)
        logger.info(f"Tarama tamamlandi: IP={ip_address}, Port sayisi={len(scan_results['open_ports'])}")
        socketio.emit('scan_results', scan_results)
    except Exception as e:
        error_msg = f'Tarama sirasinda hata: {str(e)}'
        logger.error(error_msg)
        # Log mesajını daha görünür kılmak için
        print(f"ERROR: {error_msg}")  
        socketio.emit('scan_error', {'message': error_msg})

def perform_scan(ip_address):
    # Initialize the scanner
    scanner = nmap.PortScanner()
    
    try:
        # Run OS detection and service detection scan
        scanner.scan(ip_address, arguments='-O -sV')
        
        # Get OS information
        os_info = "Bilinmiyor"
        if ip_address in scanner.all_hosts() and 'osmatch' in scanner[ip_address]:
            if len(scanner[ip_address]['osmatch']) > 0:
                os_info = scanner[ip_address]['osmatch'][0]['name']
        
        # Get open ports and services
        open_ports = []
        
        if ip_address in scanner.all_hosts():
            # Protokolleri güvenli bir şekilde al
            try:
                protocols = scanner[ip_address].all_protocols()
            except (AttributeError, KeyError):
                protocols = []
                logger.warning(f"Protokol listesi alinamadi: IP={ip_address}")
            
            for proto in protocols:
                try:
                    ports = scanner[ip_address][proto].keys()
                    for port in ports:
                        port_data = scanner[ip_address][proto][port]
                        if port_data['state'] == 'open':
                            service_info = {
                                'port': port,
                                'protocol': proto,
                                'service': port_data.get('name', 'unknown'),
                                'version': port_data.get('product', '') + ' ' + port_data.get('version', '')
                            }
                            open_ports.append(service_info)
                except (AttributeError, KeyError, TypeError) as e:
                    logger.warning(f"Port bilgisi alinamadi: {proto} protokolü, Hata: {str(e)}")
        
        # Yanıt verme durumunu kontrol et
        host_status = "erisimde"
        if not ip_address in scanner.all_hosts():
            host_status = "erisim-yok"
            logger.info(f"Hedef yanit vermedi veya erisilemez: IP={ip_address}")
        elif len(open_ports) == 0:
            host_status = "kapali-portlar"
            logger.info(f"Hedef yanit verdi fakat acik port bulunamadi: IP={ip_address}")
        
        # Prepare results
        results = {
            'ip_address': ip_address,
            'os': os_info,
            'open_ports': open_ports,
            'host_status': host_status  # Yeni alan: erişim durumu
        }
        
        return results
    
    except Exception as e:
        logger.error(f"Tarama islemi sirasinda beklenmeyen hata: {str(e)}")
        # Minimal sonuç döndür
        return {
            'ip_address': ip_address,
            'os': 'Bilinmiyor',
            'open_ports': [],
            'host_status': 'hata',
            'error_message': str(e)
        }

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 