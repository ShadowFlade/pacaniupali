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
//        \Illuminate\Support\Facades\Log::channel('local')->info(
//            ['test']
//        );
        Auth::provider('user_provider', function ($app, array $config) {
//            dd($config);
            return new UserProvider(
                $this->app['db']->connection($config['connection'] ?? null),
                $this->app['hash'],
                'users',
            );
        });
    }
}
