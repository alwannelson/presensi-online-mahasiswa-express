(function () {
    // Sidebar elements
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const resizer = document.getElementById('resizer');

    // ========== RESIZE SIDEBAR (DESKTOP) ==========
    let isResizing = false;
    let startX, startWidth;

    if (resizer) {
        resizer.addEventListener('mousedown', function (e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);
            document.body.style.cursor = 'col-resize';
            e.preventDefault();
        });
    }

    document.addEventListener('mousemove', function (e) {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        let newWidth = startWidth + dx;
        if (newWidth >= 200 && newWidth <= 400 && window.innerWidth > 768) {
            sidebar.style.width = newWidth + 'px';
            sidebar.style.minWidth = newWidth + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        isResizing = false;
        document.body.style.cursor = '';
    });

    // ========== TOGGLE SIDEBAR (DESKTOP) ==========
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
        });
    }

    // ========== TOGGLE SIDEBAR (MOBILE) ==========
    if (mobileToggleBtn) {
        mobileToggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('show');
            mobileOverlay.classList.toggle('show');
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function () {
            sidebar.classList.remove('show');
            mobileOverlay.classList.remove('show');
            if (mobileToggleBtn) {
                mobileToggleBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    // Close sidebar on window resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show');
            if (mobileOverlay) mobileOverlay.classList.remove('show');
            if (mobileToggleBtn) {
                mobileToggleBtn.querySelector('i').className = 'fas fa-bars';
            }
        }
    });

    // ========== DROPDOWN MENU ==========
    const dropdownParent = document.getElementById('studentsDropdownParent');
    if (dropdownParent) {
        const dropdownLink = dropdownParent.querySelector('.sidebar-link');
        dropdownLink.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdownParent.classList.toggle('open');
            const dropdown = document.getElementById('studentsDropdown');
            if (dropdown) dropdown.classList.toggle('show');
        });
    }

    // ========== AUTO HIDE ALERTS ==========
    setTimeout(function () {
        document.querySelectorAll('.alert-success, .alert-danger').forEach(function (alert) {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(function () {
                alert.remove();
            }, 500);
        });
    }, 5000);
})();