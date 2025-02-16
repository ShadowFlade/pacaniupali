<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamController;
use App\Models\setting;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/team', [TeamController::class, 'index'])->name('team.index');
    Route::patch('/team', [TeamController::class, 'update'])->name('team.update');
    Route::delete('/team', [TeamController::class, 'destroy'])->name('team.destroy');
});


Route::middleware('auth')->group(function () {
    Route::get('/setting', [setting::class, 'index'])->name('setting.index');
    Route::patch('/setting', [setting::class, 'update'])->name('setting.update');
    Route::delete('/setting', [setting::class, 'destroy'])->name('setting.destroy');
});


require __DIR__.'/auth.php';
