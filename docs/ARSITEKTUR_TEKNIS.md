# Arsitektur Teknis: "Iterative Reduction Cascade" (IRC)

Arsitektur Agentika File dirancang untuk mengeksekusi konsep IRC secara mulus. Ini adalah sinergi antara antarmuka pengguna (React), logika eksekusi inti (TypeScript), dan kecerdasan buatan (Google Gemini API).

### Alur Kerja Sistem (End-to-End)

1.  **Input Pengguna (`components/Dropzone.tsx`):** Pengguna memilih file dan `CompressionProfile` (`Kualitas Arsip`, `Seimbang`, atau `Ukuran Super Kecil`).
2.  **Inisiasi Proses (`App.tsx`):** Fungsi `handleProcessStart` dipicu. State aplikasi diubah menjadi `PROCESSING`, dan fungsi utama `processFile` dipanggil.
3.  **Konsultasi dengan AI (`services/geminiService.ts`):**
    *   Fungsi `getIterativeReductionPlan` dipanggil dengan nama file dan profil yang dipilih.
    *   Sebuah *prompt* yang sangat spesifik dikirim ke model AI **`gemini-2.5-flash`**. Prompt ini menginstruksikan AI untuk bertindak sebagai "AI Compression Strategist" dan membuat rencana IRC.
    *   Permintaan ini menyertakan `responseSchema` yang memaksa AI untuk mengembalikan output dalam format JSON yang ketat, sesuai dengan tipe `IterativeReductionPlan` di `types.ts`.
4.  **Penerimaan Rencana:** `geminiService` mengembalikan sebuah objek `IterativeReductionPlan` yang berisi `planning_summary` dan sebuah array `cascade` dari `CascadeStrategy`.
5.  **Eksekusi IRC (`App.tsx` - `processFile`):**
    *   Logika inti aplikasi kini bertindak sebagai **IRC Executor**.
    *   Sistem melakukan iterasi melalui array `plan.cascade` menggunakan loop `for...of`.
    *   Untuk setiap `strategy` dalam cascade:
        *   Sebuah log `CASCADE_STEP` ditambahkan ke UI (`ProcessingDashboard.tsx`).
        *   Parameter dari strategi (misalnya `quality`, `format`, `resolution_scale`) dikonfigurasi untuk library `browser-image-compression`.
        *   Kompresi dieksekusi.
        *   **Verifikasi Kunci:** `if (compressedBlob.size < file.size)`.
        *   Jika **berhasil**, hasilnya disimpan, `successfulStrategy` di-set, dan loop dihentikan (`break;`).
        *   Jika **gagal**, log `FAILURE` ditampilkan, dan loop berlanjut ke strategi berikutnya yang lebih agresif.
6.  **Penyajian Hasil:**
    *   **Sukses (`components/ResultCard.tsx`):** Jika loop dihentikan (sukses), UI menampilkan ringkasan, penghematan, dan yang terpenting, **strategi spesifik yang berhasil** dari cascade dan **jumlah upaya** yang diperlukan (`attemptCount`).
    *   **Gagal Total (`components/UnsuccessfulResultCard.tsx`):** Jika loop selesai tanpa `break`, itu berarti tidak ada strategi yang berhasil. UI menampilkan pesan bahwa file sudah optimal.

### Komponen Kode Kunci

*   **`types.ts`:** Mendefinisikan struktur data inti:
    *   `IterativeReductionPlan`: Kontainer untuk seluruh rencana AI.
    *   `CascadeStrategy`: Mendefinisikan satu langkah/upaya dalam cascade, lengkap dengan `tool`, `parameters`, dan `rationale`. Ini adalah unit atom dari IRC.

*   **`services/geminiService.ts`:** Jembatan ke kecerdasan AI.
    *   **Prompt Engineering:** Promptnya dirancang untuk tidak hanya meminta JSON, tetapi untuk "berpikir" seperti seorang ahli kompresi yang menyusun rencana darurat berlapis.
    *   **Schema Enforcement:** Penggunaan `responseSchema` sangat krusial. Ini memastikan bahwa output AI selalu dapat diprediksi dan dapat langsung digunakan oleh aplikasi tanpa perlu parsing string yang rapuh, mengurangi kemungkinan error secara drastis.

*   **`App.tsx` (`processFile` function):** Ini adalah jantung eksekusi. Fungsi ini telah berevolusi dari sekadar "menjalankan kompresi" menjadi "mengelola dan mengeksekusi rencana strategis multi-langkah". State seperti `reductionPlan`, `successfulStrategy`, dan `attemptCount` adalah saksi dari arsitektur baru ini.

*   **`browser-image-compression`:** Meskipun AI yang membuat strategi, library inilah yang menjadi "otot" yang melakukan kompresi sebenarnya di browser. Agentika bertindak sebagai "otak" yang mengarahkan "otot" ini dengan cara yang cerdas dan berulang.
