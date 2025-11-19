<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use GetStream\StreamChat\Client;

class StreamServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        // Bind Stream Client ke container Laravel (sehingga bisa diakses melalui app('stream'))
        $this->app->singleton(Client::class, function ($app) {
            $key = env('STREAM_API_KEY', 'cwe495bhsqjz');
            $secret = env('STREAM_API_SECRET', 'zxgmjpne66u5bbatux63u3mzqrb7tqe2ytxmendbzeyfwkbs4t5ybtdna2vpetyx');

            // Cek apakah key dan secret sudah di set
            if (!$key || !$secret) {
                throw new \Exception('Stream API Key or Secret not set in environment.');
            }

            return new Client($key, $secret);
        });

        // Buat alias agar lebih mudah dipanggil
        $this->app->alias(Client::class, 'stream');
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
