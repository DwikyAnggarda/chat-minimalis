<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DoctorController extends Controller
{
    public function index()
    {
        // Ambil semua user yang role-nya 'admin'
        // Anda bisa mengganti 'admin' dengan 'doctor' jika nanti role-nya dibedakan
        $doctors = User::where('role', 'admin')->get(['id', 'name', 'email', 'role']);

        return response()->json($doctors);
    }
}