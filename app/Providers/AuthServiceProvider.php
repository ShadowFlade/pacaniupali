<?php

namespace App\Providers;

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
        \Illuminate\Support\Facades\Log::channel('local')->info(
            ['test']
        );
        Auth::provider('user_provider', function ($app, array $config) {
            return new UserProvider();
        });
    }
}
