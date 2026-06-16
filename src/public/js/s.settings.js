document.getElementById('ubahFotoBtn')?.addEventListener('click', () => alert('Fitur upload foto akan segera tersedia.'));
document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Perubahan profile telah disimpan!');
});


// Ambil elemen input dan button
const inpNickname = document.getElementById('nickname');
const inpEmail = document.getElementById('email');
const inpTelp = document.getElementById('telp');
const inpAddress = document.getElementById('alamat');
const btnSubmit = document.getElementById('button-submit');

// Simpan nilai awal (default)
const defaultValue = {
    nickname: inpNickname?.value || '',
    email: inpEmail?.value || '',
    telp: inpTelp?.value || '',
    address: inpAddress?.value || ''
};

// Fungsi untuk mengecek apakah ada perubahan
function checkChanges() {
    const currentNickname = inpNickname?.value || '';
    const currentEmail = inpEmail?.value || '';
    const currentTelp = inpTelp?.value || '';
    const currentAddress = inpAddress?.value || '';

    const hasChanges =
        currentNickname !== defaultValue.nickname ||
        currentEmail !== defaultValue.email ||
        currentTelp !== defaultValue.telp ||
        currentAddress !== defaultValue.address;

    // Enable/disable button berdasarkan ada/tidaknya perubahan
    if (btnSubmit) {
        btnSubmit.disabled = !hasChanges;

        // Tambahkan class styling untuk visual feedback
        if (hasChanges) {
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
        } else {
            btnSubmit.style.opacity = '0.6';
            btnSubmit.style.cursor = 'not-allowed';
        }
    }

    return hasChanges;
}

// Tambahkan event listener untuk setiap input
if (inpNickname) inpNickname.addEventListener('input', checkChanges);
if (inpEmail) inpEmail.addEventListener('input', checkChanges);
if (inpTelp) inpTelp.addEventListener('input', checkChanges);
if (inpAddress) inpAddress.addEventListener('input', checkChanges);

// Jalankan pengecekan awal (button akan disable jika tidak ada perubahan)
checkChanges();