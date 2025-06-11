<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
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
    Route::get('/setting', [SettingController::class, 'index'])->name('setting.index');
    Route::patch('/setting', [SettingController::class, 'update'])->name('setting.update');
    Route::delete('/setting', [SettingController::class, 'destroy'])->name('setting.destroy');
});

//Route::resource('/games', GameController::class)->middleware('auth');


Route::middleware('auth')->group(function () {
    Route::get('/game', [GameController::class, 'index'])->name('game.index');
    Route::patch('/game', [GameController::class, 'update'])->name('game.update');
    Route::delete('/game', [GameController::class, 'destroy'])->name('game.destroy');
    Route::post('/game', [GameController::class, 'store'])->name('game.store');
});

Route::middleware('auth')->group(function () {
    Route::post(
        '/user_group',
        [\App\Http\Controllers\UserGroupController::class, 'store']
    )->name('user_group.store');
});

Route::middleware('auth')->group(function () {
    Route::post(
        '/played_with_users',
        [\App\Http\Controllers\Users\UserController::class, 'playedWithUsers']
    )->name('user.playedWithUsers');
});

require __DIR__.'/auth.php';
