# 🗺️ SUMUT ATLAS — Culinary · Tourism · Hospitality 2023

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-green.svg?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

> **Platform Analitik Spasial Interaktif untuk Eksplorasi Persebaran Objek Wisata, Usaha Kuliner, dan Sarana Perhotelan di 33 Kabupaten/Kota Provinsi Sumatera Utara Tahun 2023.**

---

## 🌟 Ikhtisar Eksekutif (Executive Overview)

**SUMUT ATLAS** adalah aplikasi web geospasial modern yang menyajikan visualisasi data regional terpadu dari Provinsi Sumatera Utara. Dibangun dengan fokus pada *geospatial intelligence*, aplikasi ini mentransformasi data statistik resmi pemerintah menjadi dashboard interaktif berestetika tinggi yang responsif, informatif, dan mudah dianalisis baik di desktop maupun perangkat seluler.

Aplikasi memetakan secara presisi **33 unit administratif (Kabupaten/Kota)** dengan data validitas 100% tanpa adanya data hilang (*missing values*) atau ketidakcocokan kode wilayah Kemendagri / BPS.

---

## ✨ Fitur Utama (Key Features)

### 1. 🗺️ Peta Koroplet Interaktif (Interactive Choropleth Leaflet Map)
- **Basemap Presisi**: Menggunakan basemap *Stadia Maps Alidade Smooth Dark* yang elegan dengan kontras tinggi.
- **Visual Feedback Instan**: Efek hover interaktif, batas poligon bercahaya (*glow highlight*), dan animasi *fly-to* halus ke wilayah target saat diklik.
- **Tooltip Geospasial**: Menampilkan nama daerah, status kota/kabupaten, kode wilayah Kemendagri, nilai metrik aktif, dan skala visual.
- **Label Administrasi Dinamis**: Label nama kabupaten/kota otomatis muncul pada tingkat perbesaran (*zoom level*) tertentu.
- **Kontrol Peta Terintegrasi**: Tombol reset tampilan ke seluruh Sumatera Utara dan mode layar penuh (*fullscreen*).

### 2. 📊 Empat Lapisan Analitik (Multi-Metric Layering)
- **🍲 Usaha Kuliner (1.293 Unit)**: Menampilkan sebaran restoran, rumah makan, dan sentra gastronomi lokal.
- **🏛️ Objek Wisata (383 Objek)**: Destinasi wisata alam, budaya, sejarah, dan rekreasi buatan.
- **🏨 Sarana Perhotelan (326 Hotel)**: Akomodasi komersial dan hotel yang beroperasi resmi.
- **✨ Hospitality Index (Skor Komposit 0–100)**: Indeks komposit tertimbang turunan (*derived metric*) yang menggabungkan ketiga pilar ekosistem pariwisata.

### 3. 🏆 Klasemen Wilayah Real-time (Regional Leaderboard)
- Peringkat dinamis 33 kabupaten/kota otomatis menyesuaikan dengan metrik lapisan peta yang aktif.
- Medali emas, perak, dan perunggu untuk tiga besar daerah unggulan.
- Bilah kemajuan komparatif (*relative progress bars*) yang memudahkan perbandingan visual antarwilayah.

### 4. 🔍 Pencarian Pintar (Smart Autocomplete Search)
- Pencarian instan berdasarkan nama kabupaten/kota atau kode Kemendagri dengan *debounce* teroptimasi.
- Klik hasil pencarian langsung mengarahkan peta ke koordinat batas poligon wilayah terpilih.

### 5. 📑 Panel Dossier Wilayah Terperinci (Deep Regional Dossier)
- Ringkasan KPI terperinci per wilayah lengkap dengan kontribusi persentase terhadap total provinsi.
- Kartu skor khusus *Hospitality Index* dengan kategorisasi status (*Hospitalitas Tinggi*, *Menengah*, atau *Potensi Berkembang*).
- Bilah profil komparasi indikator terhadap nilai tertinggi se-Sumatera Utara.
- Tombol aksi cepat: *Fokus ke Wilayah* (*Zoom in*) dan *Bagikan Tautan* (*Copy shareable URL*).

### 6. 🗃️ Data Explorer & Ekspor CSV
- Modal tabel data tabular komprehensif seluruh 33 kabupaten/kota.
- Fitur pencarian filter teks secara langsung.
- Pengurutan multi-kolom (*multi-column sort*) interaktif (Ascending / Descending).
- Fungsi unduh data tabel menjadi format `.csv` dengan sekali klik.

### 7. 📖 Transparansi Metodologi
- Penjelasan formula matematis normalisasi Min-Max.
- Dokumentasi sumber data resmi dan batas wilayah spasial.

### 8. 🔗 URL State Persistence (Deep Linking)
- Parameter URL otomatis tersinkronisasi: `?metric=[kuliner|wisata|hotel|index]&region=[kode_wilayah]`.
- Pengguna dapat membagikan tautan spesifik untuk menampilkan analisis daerah tertentu secara langsung.

---

## 📐 Formulasi Hospitality Index (Derived Metric)

Untuk memberikan wawasan sintesis yang seimbang, **Hospitality Index** dihitung menggunakan metode normalisasi skala *Min-Max*:

$$\text{norm}(x) = \frac{x - x_{\min}}{x_{\max} - x_{\min}}$$

Skor komposit dihitung dengan merata-ratakan nilai normalisasi dari ketiga pilar:

$$\text{Hospitality Index} = \left( \frac{\text{norm}(\text{wisata}) + \text{norm}(\text{kuliner}) + \text{norm}(\text{hotel})}{3} \right) \times 100$$

> **Catatan Metodologi**: Formula ini memastikan setiap pilar pariwisata memiliki kontribusi bobot yang seimbang (33,3%) tanpa bias skala absolut.

---

## 🏛️ Agregat Statistik Utama (Sumatera Utara 2023)

| Indikator | Total Provinsi | Wilayah Tertinggi | Nilai Puncak | Wilayah Terendah |
| :--- | :---: | :--- | :---: | :--- |
| **Kabupaten / Kota** | **33 Daerah** | — | — | — |
| **Usaha Kuliner** | **1.293 Usaha** | Kota Tanjung Balai & Binjai | 60 Usaha | Kab. Dairi (15 Usaha) |
| **Objek Wisata** | **383 Objek** | Kab. Samosir | 66 Objek | Kab. Pakpak Bharat (1 Objek) |
| **Sarana Hotel** | **326 Unit** | Kab. Karo | 82 Hotel | 5 Daerah (0 Hotel terdata) |

---

## 🛠️ Arsitektur Teknologi & Dependensi

Proyek ini dibangun menggunakan pustaka modern dengan efisiensi bundle optimal:

- **Frontend Core**: [React 19](https://react.dev/) + [TypeScript 5.x](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) (dengan modul HMR instan)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Design Tokens
- **Peta Geospatial**: [Leaflet 1.9](https://leafletjs.com/) + [React-Leaflet 5](https://react-leaflet.js.org/)
- **Ubin Peta (Tiles)**: [Stadia Maps](https://stadiamaps.com/) (*Alidade Smooth Dark*)
- **Ikonografi**: [Lucide React](https://lucide.dev/)
- **Tipografi**: Plus Jakarta Sans, Inter, & JetBrains Mono

---

## 📂 Struktur Direktori Proyek

```text
SumutMaps/
├── public/
│   └── data/
│       └── sumatera-utara.geojson   # Data spasial batas 33 kab/kota + atribut statistik 2023
├── src/
│   ├── assets/                     # Aset statis & logo
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── Header.tsx           # Navigasi utama + agregat KPI provinsi
│   │   │   ├── SearchBox.tsx        # Kotak pencarian kab/kota
│   │   │   ├── MetricSelector.tsx   # Pemilih 4 layer choropleth
│   │   │   ├── RankingPanel.tsx     # Klasemen daerah interaktif
│   │   │   └── MethodologyPanel.tsx # Modal dokumentasi & metodologi
│   │   ├── DataExplorer/
│   │   │   └── DataTable.tsx        # Tabel interaktif & ekspor CSV
│   │   ├── Map/
│   │   │   ├── SumutMap.tsx         # Komponen peta Leaflet & kontrol interaktif
│   │   │   └── MapLegend.tsx        # Legenda gradien nilai choropleth
│   │   └── Region/
│   │       └── RegionDetail.tsx     # Panel detail profil komprehensif wilayah
│   ├── types/
│   │   └── geography.ts             # Definisi TypeScript model data spasial & metrik
│   ├── utils/
│   │   ├── normalization.ts         # Logika normalisasi & pewarnaan choropleth
│   │   └── statistics.ts            # Komputasi agregat & perankingan daerah
│   ├── App.tsx                      # Root component & orkestrasi state URL
│   ├── index.css                    # Design system, glassmorphism, & tema gelap
│   └── main.tsx                     # Entry point React
├── index.html                       # HTML5 Shell dengan font preconnect
├── package.json                     # Konfigurasi dependensi npm
├── tsconfig.json                    # Konfigurasi TypeScript compiler
└── vite.config.ts                   # Konfigurasi Vite & Tailwind v4 plugin
```

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- **Node.js**: Versi `18.x` atau lebih baru
- **npm** atau **pnpm** / **yarn**

### Langkah-langkah

1. **Clone repositori**:
   ```bash
   git clone https://github.com/Rbin01yuh/sumut-geospatial-atlas.git
   cd sumut-geospatial-atlas
   ```

2. **Pasang seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka peramban Anda di: `http://localhost:5173` (atau port yang tertera di terminal).

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```
   Berkas siap rilis akan dihasilkan dalam direktori `dist/`.

5. **Pratinjau Hasil Build**:
   ```bash
   npm run preview
   ```

---

## 📊 Sumber Data (Data Provenance)

- **Dataset Statistik**: *Jumlah Objek Wisata, Kuliner, dan Hotel Menurut Kabupaten/Kota di Provinsi Sumatera Utara, 2023* (BPS / Satu Data Sumatera Utara).
- **Geometri Batas Spasial**: geoBoundaries ADM2 (Level Kabupaten/Kota) yang telah disesuaikan dan dipadankan dengan kode resmi Kemendagri (12.01 hingga 12.78).

---

## 👨‍💻 Kontributor & Lisensi

Dikembangkan oleh **[Rbin01yuh](https://github.com/Rbin01yuh)**.

Hak Cipta © 2026. Didistribusikan di bawah lisensi [MIT](LICENSE).
