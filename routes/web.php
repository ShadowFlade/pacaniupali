<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\Pages\MainController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SettingController;
use App\Modules\User\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get(
    '/',
    [MainController::class, 'show']
)->name('main.show');

Route::resource('/user', UserController::class)->middleware('auth');


Route::get(
    '/dashboard',
    function () {
        return Inertia::render('Dashboard');
    }
)->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(
    function () {
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    }
);

Route::middleware('auth')->group(
    function () {
        Route::get('/group', [GroupController::class, 'index'])->name('group.index');
        Route::patch('/group', [GroupController::class, 'update'])->name('group.update');
        Route::delete('/group', [GroupController::class, 'destroy'])->name('group.destroy');
        Route::post('/group', [GroupController::class, 'store'])->name('group.store');
        Route::get('/group/{id}', [GroupController::class, 'show'])->name('group.detail');

    }
);


Route::middleware('auth')->group(
    function () {
        Route::get('/setting', [SettingController::class, 'index'])->name('setting.index');
        Route::patch('/setting', [SettingController::class, 'update'])->name('setting.update');
        Route::delete('/setting', [SettingController::class, 'destroy'])->name('setting.destroy');
    }
);


Route::middleware('auth')->group(
    function () {
        Route::get('/game', [GameController::class, 'index'])->name('game.index');
        Route::get('/game/{id}', [GameController::class, 'show'])->name('game.show');
        Route::patch('/game', [GameController::class, 'update'])->name('game.update');
        Route::delete('/game', [GameController::class, 'destroy'])->name('game.destroy');
        Route::post('/game', [GameController::class, 'store'])->name('game.store');
    }
);

Route::middleware('auth')->group(
    function () {
        Route::post(
            '/user_group',
            [\App\Http\Controllers\UserGroupController::class, 'manage']
        )->name('user_group.manage');
    }
);

Route::middleware('auth')->group(
    function () {
        Route::post(
            '/played_with_users',
            [\App\Modules\User\Http\Controllers\UserController::class, 'playedWithUsers']
        )->name('user.playedWithUsers');
        Route::post(
            '/search_user',
            [\App\Modules\User\Http\Controllers\UserController::class, 'searchByUserName']
        )->name('user.searchByUserName');
    }
);

Route::prefix('invites')->middleware(['auth'])->group(
    function () {
        Route::get('/list', [\App\Modules\Invite\Http\Controllers\InviteController::class, 'index'])
             ->name('invite.index');
    });

