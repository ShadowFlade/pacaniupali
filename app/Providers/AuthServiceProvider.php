<?php

namespace App\Providers;

use App\Providers\UserProvider;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
// 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    public function boot()
    {
        $this->registerPolicies();

        Auth::provider('user_provider', function ($app, array $config) {
            return new UserProvider();
        });
    }
}
