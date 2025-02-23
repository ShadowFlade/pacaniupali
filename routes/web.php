<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProfileController;
use App\Models\setting;
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
    Route::get('/group', [GroupController::class, 'index'])->name('group.index');
    Route::patch('/group', [GroupController::class, 'update'])->name('group.update');
    Route::delete('/group', [GroupController::class, 'destroy'])->name('group.destroy');
    Route::post('/group', [GroupController::class, 'store'])->name('group.store');

});


Route::middleware('auth')->group(function () {
    Route::get('/setting', [setting::class, 'index'])->name('setting.index');
    Route::patch('/setting', [setting::class, 'update'])->name('setting.update');
    Route::delete('/setting', [setting::class, 'destroy'])->name('setting.destroy');
});


require __DIR__.'/auth.php';
