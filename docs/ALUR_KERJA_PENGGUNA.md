# Alur Kerja Pengguna: Pengalaman yang Transparan dan Memuaskan

Pengalaman pengguna (UX) Agentika File dirancang untuk mengubah proses optimasi yang biasanya membingungkan menjadi sebuah perjalanan yang jelas, transparan, dan pada akhirnya memuaskan. UI tidak menyembunyikan kompleksitas, tetapi menyajikannya sebagai bukti kecanggasan sistem.

### Langkah 1: Menyatakan Maksud (Intent)

Pengguna memulai di `components/Dropzone.tsx`. Di sini, mereka tidak hanya mengunggah file, tetapi juga membuat keputusan strategis pertama dan satu-satunya: memilih **Profil Kompresi**.

*   **`Kualitas Arsip`:** "AI, prioritaskan kualitas. Lakukan optimasi yang aman saja."
*   **`Seimbang`:** "AI, temukan keseimbangan terbaik antara ukuran dan kualitas."
*   **`Ukuran Super Kecil`:** "AI, saya perintahkan Anda untuk memperkecil file ini dengan cara apa pun yang logis. Saya siap menerima penurunan kualitas yang wajar."

Pilihan ini langsung diteruskan ke `geminiService.ts` dan menjadi parameter utama yang membentuk agresivitas dari **Iterative Reduction Cascade (IRC)** yang akan dibuat oleh AI.

### Langkah 2: Menyaksikan "Perjuangan" AI

Setelah file diunggah, pengguna tidak dibiarkan menunggu dalam kegelapan. Mereka langsung dibawa ke `components/ProcessingDashboard.tsx`. Ini adalah inti dari pengalaman transparansi Agentika.

*   **Live Log:** Pengguna melihat log real-time yang dihasilkan oleh `App.tsx`.
*   **Memahami Proses IRC:** Alih-alih hanya melihat ikon berputar, pengguna melihat langkah-langkah konkret yang diambil sistem:
    ```
    [SYSTEM] Initializing Iterative Reduction Cascade...
    [CASCADE] [UPAYA 1/4] Mencoba: Optimasi Format Asli (PNG)
    > oxipng {"quality":0.9}
    [FAILURE] GAGAL. Ukuran output tidak lebih kecil. Melanjutkan...
    [CASCADE] [UPAYA 2/4] Mencoba: Konversi Format Cerdas (AVIF)
    > AVIFenc {"format":"avif","quality":0.8}
    [SUCCESS] BERHASIL! Ukuran output lebih kecil.
    [SYSTEM] Strategi optimal ditemukan. Menyelesaikan proses...
    ```
    Log ini bukan hanya untuk developer. Ini adalah narasi yang menunjukkan kepada pengguna bahwa sistem sedang "berjuang" untuk memenuhi permintaan mereka, mencoba berbagai pendekatan atas nama mereka.

### Langkah 3: Menerima Hasil yang Cerdas

Hasil akhir bukanlah sekadar tombol unduh. Ini adalah sebuah laporan kemenangan yang detail.

#### Kasus Sukses (`components/ResultCard.tsx`)

*   **Pesan Dinamis:** Pesan keberhasilan disesuaikan berdasarkan jumlah upaya.
    *   Jika `attemptCount === 1`: "AI berhasil pada upaya pertama..."
    *   Jika `attemptCount > 1`: "Setelah 3 upaya, AI berhasil **memaksa** pengecilan ukuran..."
*   **Strategi yang Berhasil:** Kartu hasil secara eksplisit menyatakan **strategi mana dari cascade yang berhasil**. Ini memberi tahu pengguna *bagaimana* kemenangan itu diraih (misalnya, "dengan mengonversi ke AVIF" atau "dengan menurunkan resolusi sedikit").
*   **Rasionalisasi AI:** Rasionalisasi dari strategi yang berhasil juga ditampilkan, memberikan wawasan "mengapa" AI memilih langkah tersebut.

#### Kasus Gagal Total (`components/UnsuccessfulResultCard.tsx`)

*   **Penjelasan yang Meyakinkan:** Jika tidak ada strategi yang berhasil, UI tidak hanya mengatakan "Gagal". Ia menjelaskan *mengapa*: "Setelah mengeksekusi cascade dari X strategi, AI kami menetapkan bahwa file Anda sudah sangat optimal." Ini mengubah kegagalan menjadi sebuah **sertifikasi optimasi**, yang dengan sendirinya merupakan hasil yang berharga.

#### Perbandingan Visual (`components/ComparisonModal.tsx`)

Sebagai langkah terakhir, pengguna selalu dapat memverifikasi hasilnya secara visual dengan slider perbandingan, memberikan bukti nyata bahwa penurunan ukuran tidak merusak gambar secara signifikan (sesuai "quality floor" konseptual AI).
