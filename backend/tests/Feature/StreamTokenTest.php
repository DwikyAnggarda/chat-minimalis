<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;

class StreamTokenTest extends TestCase
{
    use RefreshDatabase; // Memastikan database di-reset untuk setiap test

    #[Test]
    public function unauthenticated_user_cannot_access_token_endpoint()
    {
        // 1. Lakukan request tanpa login
        $response = $this->getJson('/api/stream/token');

        // 2. Verifikasi: Response harus 401 (Unauthorized)
        $response->assertStatus(401);
    }

    #[Test]
    public function authenticated_customer_can_get_stream_token()
    {
        // 1. Buat user dengan role default 'customer'
        $user = User::factory()->create();

        // 2. Lakukan request sebagai customer yang login
        $response = $this->actingAs($user, 'sanctum')
                        ->getJson('/api/stream/token');

        // 3. Verifikasi Status: Response harus 200 OK
        $response->assertStatus(200);

        // 4. Verifikasi Struktur Response (sama seperti sebelumnya)
        $response->assertJsonStructure([
            'token',
            'stream_user_id',
            'stream_api_key',
        ]);

        // 5. Verifikasi Content
        $response->assertJsonFragment([
            'stream_user_id' => (string) $user->id,
        ]);
    }

    #[Test]
    public function authenticated_admin_can_get_stream_token()
    {
        // 1. Buat user dengan role 'admin'
        $admin = User::factory()->admin()->create();

        // 2. Lakukan request sebagai admin yang login
        $response = $this->actingAs($admin, 'sanctum')
                        ->getJson('/api/stream/token');

        // 3. Verifikasi Status: Response harus 200 OK
        $response->assertStatus(200);

        // 4. Verifikasi Struktur Response (sama seperti sebelumnya)
        $response->assertJsonStructure([
            'token',
            'stream_user_id',
            'stream_api_key',
        ]);

        // 5. Verifikasi Content
        $response->assertJsonFragment([
            'stream_user_id' => (string) $admin->id,
        ]);
    }
}