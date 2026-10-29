/* Script portofolio: dark mode, filter proyek, kalkulator, validasi form */
'use strict';

/* ---------- 1. Dark mode toggle ---------- */
const htmlEl = document.documentElement;
const tombolTema = document.getElementById('themeToggle');

function setTema(tema) {
  htmlEl.setAttribute('data-bs-theme', tema);
  tombolTema.textContent = tema === 'dark' ? 'Mode terang' : 'Mode gelap';
  try { localStorage.setItem('tema', tema); } catch (e) { /* abaikan */ }
}

function toggleTema() {
  setTema(htmlEl.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark');
}

try {
  const tersimpan = localStorage.getItem('tema');
  if (tersimpan) setTema(tersimpan);
} catch (e) { /* abaikan */ }
tombolTema.addEventListener('click', toggleTema);

/* ---------- 2. Filter & search proyek ---------- */
const inputCari = document.getElementById('cariProyek');
const pilihKategori = document.getElementById('filterKategori');
const kartuProyek = document.querySelectorAll('.proyek');
const pesanKosong = document.getElementById('proyekKosong');

function filterProyek() {
  const kata = inputCari.value.trim().toLowerCase();
  const kategori = pilihKategori.value;
  let tampil = 0;

  kartuProyek.forEach(function (kartu) {
    const cocokKata = kartu.textContent.toLowerCase().includes(kata);
    const cocokKategori = kategori === 'semua' || kartu.dataset.kategori === kategori;
    const terlihat = cocokKata && cocokKategori;
    kartu.classList.toggle('d-none', !terlihat);
    if (terlihat) tampil++;
  });

  pesanKosong.classList.toggle('d-none', tampil > 0);
}

inputCari.addEventListener('input', filterProyek);
pilihKategori.addEventListener('change', filterProyek);

/* ---------- 3. Kalkulator estimasi biaya ---------- */
const HARGA_PER_HALAMAN = 150000;
const HARGA_PER_HARI = 100000;
const BIAYA_RESPONSIF = 200000;

function formatRupiah(angka) {
  return 'Rp ' + Math.round(angka).toLocaleString('id-ID');
}

function hitungEstimasi(halaman, pengali, hari, responsif) {
  const biayaHalaman = halaman * HARGA_PER_HALAMAN;
  const biayaHari = hari * HARGA_PER_HARI;
  const tambahan = responsif ? BIAYA_RESPONSIF : 0;
  return (biayaHalaman + biayaHari) * pengali + tambahan;
}

document.getElementById('formEstimasi').addEventListener('submit', function (e) {
  e.preventDefault();
  const halaman = parseInt(document.getElementById('jumlahHalaman').value, 10);
  const hari = parseInt(document.getElementById('hariKerja').value, 10);
  const pengali = parseFloat(document.getElementById('jenisSitus').value);
  const responsif = document.getElementById('fiturResponsif').checked;
  const hasil = document.getElementById('hasilEstimasi');
  const rincian = document.getElementById('rincianEstimasi');

  if (!(halaman >= 1) || !(hari >= 1)) {
    hasil.textContent = 'Rp 0';
    rincian.textContent = 'Jumlah halaman dan hari kerja harus berupa angka minimal 1.';
    return;
  }

  const total = hitungEstimasi(halaman, pengali, hari, responsif);
  hasil.textContent = formatRupiah(total);
  rincian.textContent = halaman + ' halaman x ' + formatRupiah(HARGA_PER_HALAMAN) +
    ' + ' + hari + ' hari x ' + formatRupiah(HARGA_PER_HARI) +
    ', dikali ' + pengali + (responsif ? ', ditambah fitur responsif.' : '.');
});

/* ---------- 4. Validasi form kontak ---------- */
const formKontak = document.getElementById('formKontak');
const notif = document.getElementById('notifKontak');

function setValid(input, valid) {
  input.classList.toggle('is-invalid', !valid);
  input.classList.toggle('is-valid', valid);
  return valid;
}

function validasiKontak() {
  const nama = document.getElementById('nama');
  const email = document.getElementById('email');
  const pesan = document.getElementById('pesan');
  const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const a = setValid(nama, nama.value.trim().length >= 3);
  const b = setValid(email, polaEmail.test(email.value.trim()));
  const c = setValid(pesan, pesan.value.trim().length >= 10);
  return a && b && c;
}

formKontak.addEventListener('submit', function (e) {
  e.preventDefault();
  if (validasiKontak()) {
    const nama = document.getElementById('nama').value.trim();
    notif.textContent = 'Terima kasih, ' + nama + '. Pesanmu sudah terkirim.';
    notif.classList.remove('d-none');
    formKontak.reset();
    formKontak.querySelectorAll('.form-control').forEach(function (el) {
      el.classList.remove('is-valid', 'is-invalid');
    });
  } else {
    notif.classList.add('d-none');
  }
});
