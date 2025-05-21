// DOM elements
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const ipAddressInput = document.getElementById('ip-address');
const scanButton = document.getElementById('scan-button');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessage = document.getElementById('error-message');
const errorText = document.querySelector('#error-message .error');
const scanResults = document.getElementById('scan-results');
const resultIP = document.getElementById('result-ip');
const resultOS = document.getElementById('result-os');
const portsList = document.getElementById('ports-list');
const hostStatusMessage = document.getElementById('host-status-message');

// Initialize Socket.IO connection
const socket = io();

// Regular expression for IP address validation
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// Connection event handlers
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('connection_status', (data) => {
    if (data.status === 'connected') {
        statusIndicator.classList.remove('disconnected');
        statusIndicator.classList.add('connected');
        statusText.textContent = data.message;
        scanButton.disabled = false;
    } else {
        statusIndicator.classList.remove('connected');
        statusIndicator.classList.add('disconnected');
        statusText.textContent = data.message || 'Sunucuya bağlanılamadı';
        scanButton.disabled = true;
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    statusIndicator.classList.remove('connected');
    statusIndicator.classList.add('disconnected');
    statusText.textContent = 'Sunucuya bağlanılamadı';
    scanButton.disabled = true;
});

// Scan result event handlers
socket.on('scan_results', (data) => {
    hideLoading();
    showResults(data);
});

socket.on('scan_error', (data) => {
    hideLoading();
    showError(data.message);
});

// Event listeners
ipAddressInput.addEventListener('input', validateIpAddress);
scanButton.addEventListener('click', startScan);

// Functions
function validateIpAddress() {
    const ipAddress = ipAddressInput.value.trim();
    const isValid = ipRegex.test(ipAddress);
    
    if (isValid) {
        ipAddressInput.style.borderColor = '#2ecc71';
    } else {
        ipAddressInput.style.borderColor = ipAddress ? '#e74c3c' : '#ddd';
    }
    
    return isValid;
}

function startScan() {
    if (!validateIpAddress()) {
        showError('Lütfen geçerli bir IP adresi girin.');
        return;
    }
    
    const ipAddress = ipAddressInput.value.trim();
    
    // Hide previous results or errors
    hideResults();
    hideError();
    
    // Show loading indicator
    showLoading();
    
    // Send scan request to server
    socket.emit('scan_request', { ip_address: ipAddress });
}

function showLoading() {
    loadingIndicator.classList.remove('hidden');
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showResults(data) {
    // Display IP address
    resultIP.textContent = data.ip_address;
    
    // Display OS info
    resultOS.textContent = data.os;
    
    // Clear previous ports list
    portsList.innerHTML = '';
    
    // Hedef durumuna göre bilgi mesajı ekleme
    const hostStatus = data.host_status || "erisimde";
    
    // Hedef durum mesajını göster
    updateHostStatusMessage(hostStatus, data);
    
    if (hostStatus === "erisim-yok") {
        // Hedef yanıt vermedi veya erişilemez durumda
        const row = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.colSpan = 4;
        messageCell.textContent = 'Hedef yanıt vermedi veya erişilemez durumda';
        messageCell.style.textAlign = 'center';
        messageCell.style.backgroundColor = '#fff3cd';
        messageCell.style.color = '#856404';
        messageCell.style.padding = '15px';
        row.appendChild(messageCell);
        portsList.appendChild(row);
        
        // Özel bir stil ekle
        document.getElementById('scan-results').classList.add('no-response');
    } 
    else if (hostStatus === "kapali-portlar") {
        // Hedef yanıt verdi ama açık port yok
        const row = document.createElement('tr');
        const messageCell = document.createElement('td');
        messageCell.colSpan = 4;
        messageCell.textContent = 'Hedef yanıt verdi fakat açık port bulunamadı';
        messageCell.style.textAlign = 'center';
        messageCell.style.backgroundColor = '#e2f3f8';
        messageCell.style.color = '#0c5460';
        messageCell.style.padding = '15px';
        row.appendChild(messageCell);
        portsList.appendChild(row);
    }
    else if (data.open_ports && data.open_ports.length > 0) {
        // Açık portlar varsa normal şekilde göster
        data.open_ports.forEach(port => {
            const row = document.createElement('tr');
            
            const portCell = document.createElement('td');
            portCell.textContent = port.port;
            row.appendChild(portCell);
            
            const protocolCell = document.createElement('td');
            protocolCell.textContent = port.protocol;
            row.appendChild(protocolCell);
            
            const serviceCell = document.createElement('td');
            serviceCell.textContent = port.service;
            row.appendChild(serviceCell);
            
            const versionCell = document.createElement('td');
            versionCell.textContent = port.version;
            row.appendChild(versionCell);
            
            portsList.appendChild(row);
        });
    } else {
        // Açık port bulunamadı (eski kod için geriye dönük uyumluluk)
        const row = document.createElement('tr');
        const noPortsCell = document.createElement('td');
        noPortsCell.colSpan = 4;
        noPortsCell.textContent = 'Açık port bulunamadı';
        noPortsCell.style.textAlign = 'center';
        row.appendChild(noPortsCell);
        portsList.appendChild(row);
    }
    
    // Show results container
    scanResults.classList.remove('hidden');
}

function hideResults() {
    scanResults.classList.add('hidden');
}

// Hedef durum mesajını güncelle
function updateHostStatusMessage(status, data) {
    let message = '';
    let badgeClass = '';
    
    // Durum sınıfını temizle
    document.getElementById('scan-results').classList.remove('no-response');
    document.getElementById('scan-results').classList.remove('scan-error');
    
    switch(status) {
        case 'erisim-yok':
            message = 'Hedef yanıt vermedi veya erişilemez durumda';
            badgeClass = 'warning';
            document.getElementById('scan-results').classList.add('no-response');
            break;
        case 'kapali-portlar':
            message = 'Hedef yanıt verdi fakat açık port bulunamadı';
            badgeClass = 'info';
            break;
        case 'erisimde':
            message = 'Hedef erişilebilir durumda ve açık portlar tespit edildi';
            badgeClass = 'success';
            break;
        case 'hata':
            message = 'Tarama sırasında bir hata oluştu';
            badgeClass = 'error';
            document.getElementById('scan-results').classList.add('scan-error');
            break;
        default:
            message = 'Belirsiz durum';
            badgeClass = 'error';
    }
    
    // Durum mesajını HTML ile oluştur
    hostStatusMessage.innerHTML = `
        <span>${message}</span>
        <span class="status-badge ${badgeClass}">${status}</span>
    `;
    
    // Eğer hata mesajı varsa onu da göster
    if (status === 'hata' && data && data.error_message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-details';
        errorDiv.innerHTML = `<p>Hata detayı: ${data.error_message}</p>`;
        hostStatusMessage.appendChild(errorDiv);
    }
} 