# 💬 Chat Minimalis

Aplikasi web minimalis untuk konsultasi dan chat 1:1 antara Customer dan Admin.

## 🚀 Stack Teknologi

| Kategori | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | SPA dengan autentikasi Sanctum |
| **Backend** | Laravel 12 | REST API, autentikasi, token generation |
| **Database** | PostgreSQL | Penyimpanan data user dan role |
| **Real-time Chat** | GetStream.io | Service chat real-time |

## ✨ Fitur

- Autentikasi (Login/Register) dengan Laravel Sanctum
- Role-based access (`admin`, `customer`)
- Chat 1:1 persistent menggunakan GetStream.io
- API-driven architecture

## 💻 Setup Lokal

### 1. Persyaratan

- PHP 8.2+
- Composer
- Node.js & npm
- PostgreSQL
- Akun GetStream.io

### 2. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

**Konfigurasi `.env`:**

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=chat_minimalis
DB_USERNAME=your_username
DB_PASSWORD=your_password

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

**Migrasi & Seeding:**

```bash
php artisan migrate --seed
```

> **Admin default:** `admin@example.com` / `12345678`

**Jalankan server:**

```bash
php artisan serve
```

### 3. Frontend (React)

```bash
cd frontend
npm install
```

**Konfigurasi `.env`:**

```env
VITE_APP_URL=http://127.0.0.1:8000
VITE_API_URL=http://127.0.0.1:8000/api
```

**Jalankan dev server:**

```bash
npm run dev
```

## ⚙️ Setup GetStream.io

### 1. Buat Akun & Project

1. Daftar di [GetStream.io](https://getstream.io)
2. Buat **App Project** baru
3. Masuk ke project yang baru dibuat
4. Klik menu **Chat Messaging**
5. Cari menu **Integration Code** untuk mendapatkan API Key dan Secret

### 2. Konfigurasi Domain Allowlist

Untuk mengakses API GetStream dari localhost, Anda perlu menambahkan domain ke allowlist:

1. **Setup domain publik** (gunakan [Ngrok](https://ngrok.com) untuk development):
   ```bash
   ngrok http 8000
   ```
   
2. **Tambahkan domain ke GetStream:**
   - Klik menu **Moderation**
   - Cari submenu **Advanced Filters**
   - Klik **New Advanced Filters**
   - Pilih **Domain Allowlist** dari dropdown
   - Masukkan domain Ngrok Anda (contoh: `https://abc123.ngrok.io`)
   - Simpan perubahan

> **Catatan:** Untuk production, ganti dengan domain asli Anda.

## 🔐 Keamanan

- `STREAM_API_SECRET` hanya digunakan di backend (server-side)
- Frontend hanya menerima token yang di-generate oleh Laravel
- Jangan expose API Secret ke client-side

## 📝 Lisensi

[Sesuaikan dengan lisensi project Anda]