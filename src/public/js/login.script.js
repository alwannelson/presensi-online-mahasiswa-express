(function () {
  const roleBtns = document.querySelectorAll('.role-btn');
  const roleInput = document.getElementById('roleInput');
  const dynamicTitle = document.getElementById('dynamicTitle');
  const dynamicSubtitle = document.getElementById('dynamicSubtitle');
  const usernameInput = document.getElementById('username');
  const lblUsername = document.getElementById('lbl-username');

  // Element error message untuk client
  const clientErrorDiv = document.getElementById('clientErrorMessage');
  const clientErrorText = document.getElementById('errorText');

  // Variabel untuk timeout auto-hide
  let errorTimeout = null;

  // Fungsi untuk menampilkan error message (client-side)
  function showClientError(message) {
    // Sembunyikan dulu jika ada
    clientErrorDiv.classList.remove('show', 'hide');
    clientErrorText.innerText = message;
    clientErrorDiv.classList.add('show');

    // Auto hide setelah 5 detik
    if (errorTimeout) clearTimeout(errorTimeout);
    errorTimeout = setTimeout(() => {
      hideClientError();
    }, 5000);
  }

  // Fungsi untuk menyembunyikan error message dengan animasi
  function hideClientError() {
    if (clientErrorDiv.classList.contains('show')) {
      clientErrorDiv.classList.add('hide');
      setTimeout(() => {
        clientErrorDiv.classList.remove('show', 'hide');
        clientErrorText.innerText = '';
      }, 300);
    }
  }

  // Fungsi untuk membersihkan error timeout saat role berubah
  function clearErrorTimeout() {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
      errorTimeout = null;
    }
  }

  // Switch role function
  function switchRole(role) {
    roleInput.value = role;

    // Sembunyikan error message saat ganti role
    hideClientError();
    clearErrorTimeout();

    if (role === 'student') {
      dynamicTitle.innerHTML = 'Login Mahasiswa';
      lblUsername.innerText = 'NIM atau BP';
      dynamicSubtitle.innerHTML = 'Ambil presensi pembelajaran hari ini.';
      usernameInput.type = 'text';

      roleBtns.forEach((btn) => {
        if (btn.getAttribute('data-role') === 'student') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    } else {
      dynamicTitle.innerHTML = 'Login Dosen';
      lblUsername.innerText = 'Email';
      dynamicSubtitle.innerHTML = 'Kelola kelas, presensi, dan materi perkuliahan.';
      usernameInput.type = 'email';

      roleBtns.forEach((btn) => {
        if (btn.getAttribute('data-role') === 'lecturer') {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }
  }

  // Event listener untuk tab role
  roleBtns.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const selectedRole = this.getAttribute('data-role');
      switchRole(selectedRole);
    });
  });

  // Client-side validation sebelum submit
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', function (e) {
    const role = roleInput.value;
    const username = usernameInput.value.trim();
    const password = document.getElementById('password').value;

    // Validasi 1: Field kosong
    if (!username || !password) {
      e.preventDefault();
      showClientError('Harap isi username/NIM dan kata sandi.');
      return false;
    }

    // Validasi 2: Cek spasi pada username
    if (username.includes(' ')) {
      e.preventDefault();
      showClientError('Username/NIM tidak boleh mengandung spasi.');
      return false;
    }

    // Validasi berdasarkan role
    if (role === 'student') {
      // Validasi NIM harus 7 digit angka
      if (username.length !== 7) {
        e.preventDefault();
        showClientError('NIM harus 7 angka (contoh: 2510001).');
        return false;
      }
      if (isNaN(username)) {
        e.preventDefault();
        showClientError('NIM harus berupa angka saja.');
        return false;
      }
    } else if (role === 'lecturer') {
      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(username)) {
        e.preventDefault();
        showClientError('Masukkan email yang valid (contoh: nama@domain.com).');
        return false;
      }
    }

    // Validasi password minimal 4 karakter
    if (password.length < 4) {
      e.preventDefault();
      showClientError('Password minimal 4 karakter.');
      return false;
    }

    // Jika semua validasi client lolos, submit akan dilanjutkan ke server
    hideClientError();
    clearErrorTimeout();
    return true;
  });

  // Auto-hide untuk server error message
  const serverErrorMsg = document.getElementById('serverErrorMessage');
  if (serverErrorMsg) {
    setTimeout(() => {
      serverErrorMsg.classList.add('hide');
      setTimeout(() => {
        if (serverErrorMsg) serverErrorMsg.remove();
      }, 300);
    }, 5000);
  }

  // Inisialisasi role default (student)
  switchRole('student');

  // Handle video autoplay
  const video = document.getElementById('bgVideo');
  if (video) {
    video.play().catch((e) => {
      console.log('Auto-play dicegah, user perlu interaksi.');
      document.body.addEventListener('click', function playVideoOnce() {
        video.play().catch(() => { });
        document.body.removeEventListener('click', playVideoOnce);
      });
    });
  }

  // Bersihkan timeout saat halaman di-unload
  window.addEventListener('beforeunload', function () {
    if (errorTimeout) clearTimeout(errorTimeout);
  });
})();