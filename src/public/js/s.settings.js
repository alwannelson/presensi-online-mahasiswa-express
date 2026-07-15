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
const inpPassword = document.getElementById('password');
const btnSubmit = document.getElementById('button-submit');

// Simpan nilai awal (default)
const defaultValue = {
    nickname: inpNickname?.value || '',
    email: inpEmail?.value || '',
    telp: inpTelp?.value || '',
    address: inpAddress?.value || '',
    password: inpPassword?.value || ''  // Tambahkan password ke defaultValue
};

// Fungsi untuk mengecek apakah ada perubahan ATAU password terisi
function checkChanges() {
    const currentNickname = inpNickname?.value || '';
    const currentEmail = inpEmail?.value || '';
    const currentTelp = inpTelp?.value || '';
    const currentAddress = inpAddress?.value || '';
    const currentPassword = inpPassword?.value || '';

    // Cek apakah ada perubahan data
    const hasDataChanges =
        currentNickname !== defaultValue.nickname ||
        currentEmail !== defaultValue.email ||
        currentTelp !== defaultValue.telp ||
        currentAddress !== defaultValue.address;

    // Cek apakah password terisi (tidak kosong)
    const isPasswordFilled = currentPassword !== '' && currentPassword.length > 0;

    // Button enable jika ada perubahan data ATAU password terisi
    const shouldEnable = hasDataChanges || isPasswordFilled;

    // Enable/disable button berdasarkan kondisi
    if (btnSubmit) {
        btnSubmit.disabled = !shouldEnable;

        // Tambahkan class styling untuk visual feedback
        if (shouldEnable) {
            btnSubmit.style.opacity = '1';
            btnSubmit.style.cursor = 'pointer';
            btnSubmit.style.backgroundColor = ''; // Reset ke warna default
        } else {
            btnSubmit.style.opacity = '0.6';
            btnSubmit.style.cursor = 'not-allowed';
            btnSubmit.style.backgroundColor = '#ccc'; // Warna abu-abu saat disabled
        }
    }

    return shouldEnable;
}

// Tambahkan event listener untuk setiap input
if (inpNickname) inpNickname.addEventListener('input', checkChanges);
if (inpEmail) inpEmail.addEventListener('input', checkChanges);
if (inpTelp) inpTelp.addEventListener('input', checkChanges);
if (inpAddress) inpAddress.addEventListener('input', checkChanges);
if (inpPassword) inpPassword.addEventListener('input', checkChanges);

// Jalankan pengecekan awal (button akan disable jika tidak ada perubahan dan password kosong)
checkChanges();