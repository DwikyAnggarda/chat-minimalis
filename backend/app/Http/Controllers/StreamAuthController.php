<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GetStream\StreamChat\Client;
use Illuminate\Support\Facades\Auth;

class StreamAuthController extends Controller
{
    /**
     * Generate GetStream User Token for the authenticated user.
     */
    public function getToken(Client $streamClient)
    {
        // 1. Pastikan user sudah login ke Laravel
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // 2. Tentukan User ID untuk Stream
        // Kita gunakan ID user dari database Laravel sebagai Stream User ID
        $streamUserId = (string) $user->id; 
        
        // 3. Generate Token menggunakan Stream Client
        // Inilah inti dari keamanan, token dibuat menggunakan API Secret di sisi server.
        $token = $streamClient->createToken($streamUserId);

        // 4. Update User di Stream (Opsional, tapi Direkomendasikan)
        // Kita set metadata seperti nama dan role ke Stream
        $streamClient->upsertUser([
            'id' => $streamUserId,
            'name' => $user->name,
            'role' => $this->mapRoleForStream($user->role), // Kirim role yang sudah terdaftar di Stream
            'image' => 'https://api.dicebear.com/9.x/notionists-neutral/svg?seed=Leo', // Ganti dengan path avatar user jika ada
        ]);


        // 5. Kirim Token dan API Key Publik ke Frontend
        return response()->json([
            'token' => $token,
            'stream_user_id' => $streamUserId,
            'stream_api_key' => env('STREAM_API_KEY', 'cwe495bhsqjz'), // API Key publik aman dikirim ke FE
        ]);
    }
    /**
     * Petakan role lokal ke role yang valid di Stream Chat.
     */
    protected function mapRoleForStream(?string $role): string
    {
        return match ($role) {
            'admin' => 'admin',
            'moderator' => 'moderator',
            default => 'user', // fallback aman untuk role lain (customer, dll)
        };
    }
}