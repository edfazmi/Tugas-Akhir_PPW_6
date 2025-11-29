---
edfaCuaca 
---

edfaCuaca adalah aplikasi dashboard cuaca interaktif berbasis web yang dikembangkan sebagai pemenuhan Tugas Akhir Modul 6.4 (AJAX & Web Service). Aplikasi ini mensimulasikan pemanggilan data cuaca secara asinkron (AJAX) dengan tampilan antarmuka modern dan responsif.
---


Fitur Unggulan
---

1. Pencarian Wilayah Cerdas: Mendukung pencarian 38 Provinsi di Indonesia dengan fitur autocomplete dan filter otomatis.

2. Data Cuaca Dinamis: Menampilkan kondisi cuaca saat ini (Suhu, Kelembaban, Angin) dan ramalan cuaca untuk 5 hari ke depan.

3. Simulasi Data Real-time: Menggunakan variasi skenario data JSON (Cerah, Hujan, Badai, dll) yang diacak (randomized) untuk mensimulasikan perubahan cuaca setiap kali lokasi dipilih.

4. Jam Digital & Auto-Refresh: Dilengkapi jam digital yang berjalan detik demi detik dan sistem auto-refresh data cuaca setiap 1 menit.

---
Personalisasi Tampilan
---

1. Dark Mode: Dukungan tema gelap dan terang.

2. Konversi Satuan: Toggle antara Celsius (°C) dan Fahrenheit (°F).

3. Sistem Favorit: Pengguna dapat menyimpan lokasi favorit yang tersimpan permanen di browser (LocalStorage).

---
Teknologi yang Digunakan
---

Aplikasi ini dibangun menggunakan:

1. Frontend: HTML5, Tailwind CSS (via CDN).

2. Logic: Vanilla JavaScript (ES6+).

3. Data: JSON (JavaScript Object Notation) untuk simulasi API response.

---
Struktur Proyek
---

Proyek ini disusun dengan struktur folder yaitu:

/edfaCuaca
│
├── index.html            
│
├── data/
│   └── cuaca.json        
│
├── assets/
│   ├── css/
│   │   └── style.css    
│   └── js/
│       └── app.js       
│
└── api/
    └── weather.php       

---
Cara Menjalankan
---

Karena aplikasi ini menggunakan fetch() untuk mengambil file JSON lokal, browser modern mungkin memblokir request ini karena kebijakan keamanan CORS jika file dibuka langsung (klik ganda index.html).

Disarankan menggunakan Local Server:

Opsi 1: Menggunakan VS Code (Live Server)

Buka folder proyek di Visual Studio Code.

Install ekstensi Live Server.

Klik kanan pada index.html lalu pilih "Open with Live Server".

Opsi 2: Menggunakan XAMPP/Laragon

Pindahkan folder proyek ke htdocs (XAMPP) atau www (Laragon).

Buka browser dan akses http://localhost/edfaCuaca.

---
Catatan Penggunaan Data
---

Dalam versi demo ini, aplikasi menggunakan metode Simulasi Data Lokal:

Aplikasi tidak melakukan request ke internet (Open-Meteo) untuk menghemat kuota dan memastikan stabilitas demo.

Data diambil dari data/cuaca.json yang berisi 5 skenario cuaca berbeda.

Setiap kali pengguna memilih provinsi, sistem akan memilih salah satu skenario secara acak agar data terlihat bervariasi.

---
Penulis
---

M. Azmi Edfa Alhafizh
Tugas Akhir Praktikum Pemrograman Web - Judul 6
---