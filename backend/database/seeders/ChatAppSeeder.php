<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ChatAppSeeder extends Seeder
{
    public function run()
    {
        // 1. Buat 2 Akun ADMIN
        DB::table('users')->insert([
            [
                'name' => 'Admin Support 1',
                'email' => 'admin1@app.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'Admin Manager',
                'email' => 'admin2@app.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(), 'updated_at' => now(),
            ]
        ]);

        // 2. Buat 3 Akun USER Biasa
        DB::table('users')->insert([
            [
                'name' => 'User Andi',
                'email' => 'andi@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'User Budi',
                'email' => 'budi@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'name' => 'User Citra',
                'email' => 'citra@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => now(), 'updated_at' => now(),
            ]
        ]);
    }
}