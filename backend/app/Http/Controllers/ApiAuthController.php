<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class ApiAuthController extends Controller
{
    /**
     * Otentikasi user dan berikan Sanctum token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // 1. Cek Kredensial
        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kredensial yang diberikan tidak cocok.'],
            ]);
        }
        
        // 2. Hapus token lama & Buat token baru
        // Kita beri nama token 'chat-token' agar mudah diidentifikasi
        $user->tokens()->where('name', 'chat-token')->delete();

        $token = $user->createToken('chat-token', ['read', 'write'])->plainTextToken;

        // 3. Kembalikan token ke Frontend
        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $token,
        ]);
    }

    /**
     * Logout user (hapus Sanctum token).
     */
    public function logout(Request $request)
    {
        // Hapus token yang digunakan untuk request saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }
}