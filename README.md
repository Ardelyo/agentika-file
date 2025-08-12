# Agentika File 🤖

**AI-Powered File Compression with Iterative Reduction Cascade**

Sebuah aplikasi web inovatif yang menggunakan kecerdasan buatan untuk melakukan optimasi file secara otomatis dan transparan. Berbeda dengan tools kompresi tradisional yang pasif, Agentika File bertindak sebagai agen cerdas yang tidak akan menyerah sampai menemukan cara untuk memperkecil file Anda.

<div align="center">
  
  ![Status](https://img.shields.io/badge/status-active-brightgreen)
  ![Version](https://img.shields.io/badge/version-1.0-blue)
  ![License](https://img.shields.io/badge/license-MIT-green)
  ![Made%20in](https://img.shields.io/badge/made%20in-Indonesia-red)

</div>

## 🎯 Masalah yang Dipecahkan

Pernahkah Anda mengalami situasi ini?
- ✅ Upload file ke website, tapi ditolak karena "terlalu besar"
- ✅ Mencoba kompres manual, tapi hasilnya tidak lebih kecil
- ✅ Trial-and-error mengubah pengaturan berkali-kali
- ✅ Tidak tahu strategi kompresi mana yang paling efektif
- ✅ Hasil kompresi tidak konsisten atau tidak dapat diprediksi

**Agentika File menyelesaikan semua masalah ini sekali jalan.**

## ✨ Fitur Utama

### 🧠 Iterative Reduction Cascade (IRC)
- AI merancang "tangga strategi" kompresi dari yang lembut hingga agresif
- Sistem otomatis berpindah ke strategi berikutnya jika yang sebelumnya gagal
- Tidak akan berhenti sampai menemukan cara untuk memperkecil file

### 🎛️ Profil Kompresi Cerdas
- **Kualitas Arsip**: Prioritas kualitas, optimasi aman
- **Seimbang**: Keseimbangan terbaik ukuran vs kualitas  
- **Ukuran Super Kecil**: Memperkecil dengan cara apapun yang logis

### 🔍 Transparansi Radikal
- Live log menampilkan proses "perjuangan" AI secara real-time
- Pengguna melihat setiap upaya, kegagalan, dan strategi yang berhasil
- Laporan detail strategi mana yang berhasil dan mengapa

### ⚡ Proses di Browser
- Tidak ada upload ke server - semua proses di browser Anda
- Privasi terjaga 100%
- Kecepatan maksimal tanpa ketergantungan internet

## 🚀 Demo

```
[SYSTEM] Menginisialisasi Iterative Reduction Cascade...
[CASCADE] [UPAYA 1/4] Mencoba: Optimasi PNG Lossy
[FAILURE] GAGAL. Ukuran output tidak lebih kecil. Melanjutkan...

[CASCADE] [UPAYA 2/4] Mencoba: Konversi ke AVIF Agresif  
[FAILURE] GAGAL. Ukuran output tidak lebih kecil. Melanjutkan...

[CASCADE] [UPAYA 3/4] Mencoba: Konversi Paksa ke JPG
[SUCCESS] BERHASIL! Ukuran output 67% lebih kecil.

[SYSTEM] Strategi optimal ditemukan pada upaya ke-3.
```

## 🛠️ Teknologi

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Engine**: Google Gemini 2.5-Flash dengan Structured Output
- **Compression**: browser-image-compression library
- **Architecture**: Iterative Reduction Cascade (IRC)

## 📦 Instalasi

```bash
# Clone repository
git clone https://github.com/ardelliosatr/agentika-file.git

# Masuk ke directory
cd agentika-file

# Install dependencies  
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dan tambahkan GEMINI_API_KEY Anda

# Jalankan development server
npm run dev
```

## ⚙️ Konfigurasi

1. Dapatkan API key dari [Google AI Studio](https://aistudio.google.com/)
2. Tambahkan ke file `.env`:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 🎯 Cara Penggunaan

1. **Upload File**: Drag & drop atau pilih file gambar
2. **Pilih Profil**: Tentukan prioritas (Kualitas/Seimbang/Ukuran)  
3. **Saksikan Proses**: Lihat AI bekerja secara transparan
4. **Download Hasil**: Dapatkan file yang sudah dioptimasi

## 🏗️ Arsitektur

Agentika File menggunakan arsitektur **Iterative Reduction Cascade (IRC)**:

```
User Intent → AI Planning → Strategy Execution → Result Verification
     ↓              ↓              ↓                    ↓
  Profil         Gemini API    browser-image-    File Size Check
 Kompresi       (JSON Plan)    compression           ↓
                                    ↓              Success/Retry
                               Execute Loop
```

## 🧪 Contoh Cascade Strategy

Untuk profil "Ukuran Super Kecil", AI mungkin merancang:

1. **Upaya 1**: Optimasi format asli (aman)
2. **Upaya 2**: Konversi ke AVIF/WebP (cerdas)
3. **Upaya 3**: Konversi ke JPEG + kualitas rendah (agresif)
4. **Upaya 4**: Resize + kompresi (drastis)

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)  
5. Buat Pull Request

## 📋 Roadmap

- [ ] **Dukungan Video**: IRC untuk file MP4, AVI, MOV
- [ ] **Dukungan Audio**: Optimasi MP3, WAV, FLAC
- [ ] **Dukungan Dokumen**: Kompresi PDF, DOCX
- [ ] **Batch Processing**: Upload multiple files
- [ ] **Progressive Web App**: Instalasi offline
- [ ] **Advanced AI**: Model learning dari feedback

## 📄 Lisensi

Proyek ini menggunakan lisensi [MIT](LICENSE).

## 👨‍💻 Pembuat

**Ardellio Satria Anindito** - *16 tahun, Indonesia*

Sebuah eksperimen dalam otomatisasi strategi dan interaksi manusia-AI, menciptakan paradigma baru dalam optimasi file.

- GitHub: [@ardelliosatr](https://github.com/ardelliosatr)
- Email: ardelliosatr@gmail.com

## 🙏 Acknowledgments

- Google AI untuk Gemini API
- Komunitas open source Indonesia
- Seluruh developer yang berkontribusi pada libraries yang digunakan

---

<div align="center">
  <b>Dibuat dengan ❤️ di Indonesia</b>
  <br>
  <i>Changing the way we interact with file optimization</i>
</div>

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/ardelliosatr/agentika-file?style=social)
![GitHub forks](https://img.shields.io/github/forks/ardelliosatr/agentika-file?style=social)
![GitHub issues](https://img.shields.io/github/issues/ardelliosatr/agentika-file)
![GitHub pull requests](https://img.shields.io/github/issues-pr/ardelliosatr/agentika-file)