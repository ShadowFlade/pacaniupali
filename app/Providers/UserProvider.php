<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\GenericUser;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Auth\UserProvider as BaseUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class UserProvider implements BaseUserProvider
{
    public function retrieveById($identifier)
    {
        // Реализуй логику получения пользователя по ID
    }

    public function retrieveByToken($identifier, $token)
    {
        // Реализуй, если используешь "remember me"
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        // Обновление токена "remember me"
    }

    public function retrieveByCredentials(array $credentials)
    {
        if ($this->isCredentialsValid($credentials) === false) {
            return null;
        }
//        $credentials['password'] = Hash::make($credentials['password']);
//        $userData1 = User::query()->where($credentials)->get()->toArray();
//        $userData = User::where([
//            'email' => $credentials['email'],
//            'password' => $credentials['password']
//        ])->get()->toArray();
//        dd($userData1);
//        dd($credentials['email']);
//        if (!is_null($userData)) {
//        $credentials['login'] = $credentials['email'];
//        dd(isset($credentials['email']));
//        dd(empty($credentials['email']));

        $genUser = new GenericUser([
                'email' => $credentials['email'],
                'id' => $credentials['email'],
                'password' => $credentials['password'],
            ]);
            return $genUser;
//        }

    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        return $this->isCredentialsValid($credentials);
    }

    public function isCredentialsValid(array $credentials): bool
    {
        $isHasPassword = array_key_exists('password', $credentials);
        $isHasEmail = array_key_exists('email', $credentials);
        $isHasLogin = array_key_exists('login', $credentials);

        if (!$isHasPassword || !($isHasEmail || $isHasLogin)) {
            return false;
        }
        return true;
    }

    public function rehashPasswordIfRequired(
        UserContract                 $user,
        #[\SensitiveParameter] array $credentials,
        bool                         $force = false
    )
    {

    }

}
