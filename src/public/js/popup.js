// public/js/popup.js - VERSI LENGKAP
class CustomPopup {
    constructor() {
        this.popupContainer = null;
    }

    // Method utama untuk menampilkan popup (bisa di custom)
    async show(options) {
        return new Promise((resolve) => {
            const {
                title = 'Konfirmasi',
                message = 'Apakah Anda yakin?',
                type = 'question', // question, success, error, warning, info
                confirmText = 'Ya',
                cancelText = 'Tidak',
                showCancelButton = true,
                onConfirm = null,
                onCancel = null
            } = options;

            // Buat overlay
            const overlay = document.createElement('div');
            overlay.className = 'custom-popup-overlay';
            
            // Buat popup
            const popup = document.createElement('div');
            popup.className = 'custom-popup';
            
            // Icon berdasarkan type
            const iconData = this.getIconByType(type);
            
            // Buat footer buttons
            let footerHtml = '';
            if (showCancelButton) {
                footerHtml = `
                    <button class="custom-popup-btn custom-popup-cancel">${cancelText}</button>
                    <button class="custom-popup-btn custom-popup-confirm">${confirmText}</button>
                `;
            } else {
                footerHtml = `<button class="custom-popup-btn custom-popup-confirm">${confirmText}</button>`;
            }
            
            popup.innerHTML = `
                <div class="custom-popup-header">
                    <h3 class="custom-popup-title">${title}</h3>
                    <button class="custom-popup-close">&times;</button>
                </div>
                <div class="custom-popup-body">
                    <div class="custom-popup-icon ${iconData.iconClass}">${iconData.iconHtml}</div>
                    <p class="custom-popup-message">${message}</p>
                </div>
                <div class="custom-popup-footer">
                    ${footerHtml}
                </div>
            `;
            
            overlay.appendChild(popup);
            document.body.appendChild(overlay);
            
            // Animasi muncul
            setTimeout(() => overlay.classList.add('show'), 10);
            
            // Event handlers
            const close = (result) => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                    if (result === 'confirm' && onConfirm) onConfirm();
                    if (result === 'cancel' && onCancel) onCancel();
                    resolve(result === 'confirm');
                }, 300);
            };
            
            const confirmBtn = popup.querySelector('.custom-popup-confirm');
            if (confirmBtn) confirmBtn.onclick = () => close('confirm');
            
            const cancelBtn = popup.querySelector('.custom-popup-cancel');
            if (cancelBtn) cancelBtn.onclick = () => close('cancel');
            
            popup.querySelector('.custom-popup-close').onclick = () => close('cancel');
            overlay.onclick = (e) => {
                if (e.target === overlay) close('cancel');
            };
            
            // ESC key
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    close('cancel');
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
    }

    // Helper untuk mendapatkan icon berdasarkan type
    getIconByType(type) {
        switch(type) {
            case 'success':
                return {
                    iconClass: 'custom-popup-icon-success',
                    iconHtml: '✓'
                };
            case 'error':
                return {
                    iconClass: 'custom-popup-icon-error',
                    iconHtml: '✗'
                };
            case 'warning':
                return {
                    iconClass: 'custom-popup-icon-warning',
                    iconHtml: '!'
                };
            case 'info':
                return {
                    iconClass: 'custom-popup-icon-info',
                    iconHtml: 'i'
                };
            default: // question
                return {
                    iconClass: 'custom-popup-icon-question',
                    iconHtml: '?'
                };
        }
    }

    // ============ CONFIRM (2 Tombol: Ya/Tidak) ============
    
    // Confirm biasa (question)
    async confirm(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'question',
            confirmText: 'Ya',
            cancelText: 'Tidak',
            showCancelButton: true
        });
    }
    
    // Confirm Warning (peringatan)
    async confirmWarning(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'warning',
            confirmText: 'Ya, Lanjutkan',
            cancelText: 'Batal',
            showCancelButton: true
        });
    }
    
    // Confirm Danger (berbahaya - seperti hapus)
    async confirmDanger(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'error',
            confirmText: 'Ya, Hapus!',
            cancelText: 'Batal',
            showCancelButton: true
        });
    }
    
    // ============ ALERT (1 Tombol: OK) ============
    
    // Alert Success
    async alertSuccess(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'success',
            confirmText: 'OK',
            showCancelButton: false
        });
    }
    
    // Alert Error
    async alertError(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'error',
            confirmText: 'OK',
            showCancelButton: false
        });
    }
    
    // Alert Warning
    async alertWarning(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'warning',
            confirmText: 'OK',
            showCancelButton: false
        });
    }
    
    // Alert Info
    async alertInfo(title, message) {
        return this.show({
            title: title,
            message: message,
            type: 'info',
            confirmText: 'OK',
            showCancelButton: false
        });
    }
    
    // Alert biasa (default info)
    async alert(title, message) {
        return this.alertInfo(title, message);
    }
}

// Buat instance global
window.JayPopup = new CustomPopup();