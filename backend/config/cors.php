<?php

return [
    // Pastikan path ini mencakup sanctum dan rute login
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],

    'allowed_methods' => ['*'],

    // PENTING: Harus SAMA PERSIS dengan URL browser React Anda
    // Jangan pakai '*' jika pakai credentials
    'allowed_origins' => ['http://127.0.0.1:5173', 'http://localhost:5173', 'http://127.0.0.1:8000'],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,

    // INI KUNCINYA: Wajib true agar cookie CSRF bisa lewat
    'supports_credentials' => true,
];
