<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        // 1. Tambahkan statefulApi() untuk memastikan Sanctum bekerja
        $middleware->statefulApi();

        // 2. [PERBAIKAN CSRF]: Definisikan pengecualian untuk rute POST yang tidak menggunakan session
        $middleware->validateCsrfTokens(except: [
            // Tambahkan rute login dan register API Anda di sini
            'api/login',
            'api/register', // Jika Anda memiliki rute register
        ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
