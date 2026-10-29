document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. MODUL DARK MODE TOGGLE
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');

    // Cek preferensi tema sebelumnya di localStorage
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        lightIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        darkIcon.classList.remove('hidden');
    }

    themeToggleBtn.addEventListener('click', () => {
        darkIcon.classList.toggle('hidden');
        lightIcon.classList.toggle('hidden');

        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    });

    // ==========================================
    // 2. MODUL KALKULATOR ESTIMASI BIAYA PROYEK
    // ==========================================
    const btnCalculate = document.getElementById('btn-calculate');
    const projectTypeSelect = document.getElementById('project-type');
    const pageCountInput = document.getElementById('page-count');
    const urgentOption = document.getElementById('urgent-option');
    const calcResultDiv = document.getElementById('calc-result');
    const totalPriceDisplay = document.getElementById('total-price');

    function calculateEstimateCost() {
        const basePrice = parseInt(projectTypeSelect.value) || 0;
        const pageCount = parseInt(pageCountInput.value) || 0;
        const isUrgent = urgentOption.checked;

        // Formula Perhitungan Biaya
        const additionalPageCost = pageCount * 100000;
        let total = basePrice + additionalPageCost;

        if (isUrgent) {
            total += total * 0.25; // Biaya ekspres 25%
        }

        // Format angka ke format Rupiah (IDR)
        const formattedTotal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(total);

        // Render ke DOM
        totalPriceDisplay.textContent = formattedTotal;
        calcResultDiv.classList.remove('hidden');
    }

    btnCalculate.addEventListener('click', calculateEstimateCost);

    // ==========================================
    // 3. MODUL FILTER PROYEK SHOWCASE
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update status tombol aktif
            filterButtons.forEach(btn => btn.classList.remove('active-btn', 'bg-blue-600', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300'));
            
            button.classList.add('active-btn');

            const filterValue = button.getAttribute('data-filter');

            // Logika Penyaringan DOM Card Proyek
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ==========================================
    // 4. MODUL VALIDASI FORM KONTAK
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formAlert = document.getElementById('form-alert');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset Status Error
        nameError.classList.add('hidden');
        emailError.classList.add('hidden');
        messageError.classList.add('hidden');
        formAlert.classList.add('hidden');

        // Validasi Nama
        if (nameInput.value.trim().length < 3) {
            nameError.classList.remove('hidden');
            isValid = false;
        }

        // Validasi Email
        if (!validateEmail(emailInput.value.trim())) {
            emailError.classList.remove('hidden');
            isValid = false;
        }

        // Validasi Pesan
        if (messageInput.value.trim().length < 10) {
            messageError.classList.remove('hidden');
            isValid = false;
        }

        // Tampilkan Notifikasi Keberhasilan/Kegagalan ke DOM
        if (isValid) {
            formAlert.textContent = 'Pesan Anda berhasil terkirim! Terima kasih.';
            formAlert.className = 'p-3 rounded-lg text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            formAlert.classList.remove('hidden');
            contactForm.reset();
        } else {
            formAlert.textContent = 'Silakan periksa kembali inputan Anda.';
            formAlert.className = 'p-3 rounded-lg text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            formAlert.classList.remove('hidden');
        }
    });

});
