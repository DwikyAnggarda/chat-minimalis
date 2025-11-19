<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StreamAuthController;
use App\Http\Controllers\ApiAuthController;

Route::post('/login', [ApiAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    
    Route::get('/stream/token', [StreamAuthController::class, 'getToken']);
});