# 💬 Chat Minimalis

Aplikasi web minimalis untuk konsultasi dan *chat* 1:1 antara *Customer* dan *Admin*, yang dibangun dengan *stack* modern dan layanan *real-time* pihak ketiga.

## 🚀 Stack Teknologi

Proyek ini dibangun menggunakan kombinasi teknologi *headless* dan *service* *real-time* yang skalabel:

| Kategori | Teknologi | Tujuan |
| :--- | :--- | :--- |
| **Frontend (FE)** | **React** | Antarmuka pengguna yang cepat, *responsive*, dan *single-page application* (SPA). |
| **Backend (BE)** | **Laravel 11+** (PHP) | REST API untuk Otentikasi, Logika Bisnis, dan *Server-Side Token Generation* untuk Chat. |
| **Database (DB)** | **PostgreSQL** | Database relasional utama untuk data *user*, *role*, dan data aplikasi lainnya. |
| **Real-time Chat** | **GetStream.io** | Layanan pihak ketiga untuk mesin *chat* *real-time*, penyimpanan pesan (*persistence*), dan manajemen *channel*. |

## ✨ Fitur Utama (MVP)

  * **Autentikasi:** Login dan Register *user* sederhana (menggunakan Laravel Breeze API).
  * **Role-Based Access:** Pemisahan *role* antara `admin` (misalnya, staf/dokter) dan `customer`.
  * **Chat 1:1 Persistent:** Komunikasi *real-time* (tidak hilang) antara:
      * `customer` $\leftrightarrow$ `customer`
      * `customer` $\leftrightarrow$ `admin`
  * **API-Driven Chat:** Laravel hanya mengurus otentikasi, GetStream mengurus semua lalu lintas pesan.

## 💻 Panduan Setup Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek di lingkungan lokal Anda.

### 1\. Persyaratan Sistem

Pastikan Anda telah menginstal yang berikut:

  * PHP (versi terbaru yang kompatibel dengan Laravel 11+)
  * Composer
  * Node.js & NPM/Yarn
  * PostgreSQL Server
  * Akun **GetStream** (Anda akan memerlukan **API Key** dan **Secret**)

### 2\. Setup Backend (Laravel)

```bash
# Clone repository
git clone https://github.com/DwikyAnggarda/chat-minimalis.git
cd chat-minimalis

# Instal dependensi PHP
composer install

# Buat file .env dan generate key
cp .env.example .env
php artisan key:generate
```

#### Konfigurasi Database & Environment

Edit file `.env` dan sesuaikan koneksi database untuk PostgreSQL Anda:

```env
# ... bagian lain

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=nama_db_minimalis
DB_USERNAME=username_pgsql
DB_PASSWORD=password_pgsql

# Konfigurasi GetStream (Akan kita gunakan di langkah selanjutnya)
STREAM_API_KEY="[MASUKKAN API KEY ANDA DARI GETSTREAM]"
STREAM_API_SECRET="[MASUKKAN API SECRET ANDA DARI GETSTREAM]"
```

#### Jalankan Migrasi dan Seeding

Jalankan migrasi database untuk membuat tabel, termasuk kolom `role` di tabel `users`.

```bash
php artisan migrate

# Jalankan seeder untuk membuat akun admin default
php artisan db:seed
```

> Akun Admin Default: `email: admin@example.com` | `password: 12345678`

#### Jalankan Server Laravel

```bash
php artisan serve
```

Server Laravel akan berjalan di `http://127.0.0.1:8000`.

### 3\. Setup Frontend (React)

# Instal dependensi Node.js
npm install 
# atau yarn install
```

#### Konfigurasi Environment React

Buat file `.env` di *root* proyek React Anda untuk menyimpan *endpoint* API dan *public key* Stream:

```env
# URL API Laravel Anda
REACT_APP_API_URL=http://127.0.0.1:8000/api
# API Key Publik GetStream (Aman untuk Client Side)
REACT_APP_STREAM_API_KEY="[MASUKKAN API KEY PUBLIK ANDA]" 
```

#### Jalankan Server React

```bash
npm start
# atau yarn start
```

## ⚙️ Integrasi Chat dengan GetStream

Integrasi *chat* dibagi menjadi dua bagian:

1.  **Backend (Laravel):** Menggunakan **PHP SDK** untuk memverifikasi *user* yang *login* dan menghasilkan **User Token** yang aman (*Server-Side Token Generation*).
2.  **Frontend (React):** Menggunakan **React SDK** dan **UI Components** untuk menerima *token* dari Laravel dan terhubung langsung ke layanan GetStream, yang kemudian mengelola semua fungsionalitas *chat*.

> **Keamanan:** Perhatikan bahwa **`STREAM_API_SECRET`** hanya digunakan di sisi Laravel dan tidak boleh dipublikasikan ke *client side*.