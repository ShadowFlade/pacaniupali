<?php

namespace App\Providers;

use Illuminate\Support\Facades\Http;

class UserProvider
{
    public function retrieveByCredentials(array $credentials)
    {

        if ($this->validateCredentials($credentials) === false) {
            return null;
        }

        return new GenericUser([
            'id' => $credentials['id'],
            'email' => $credentials['email'],
            'login' => $credentials['login'],
        ]);
    }

    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        $isHasPassword = array_key_exists('password', $credentials);
        $isHasEmail = array_key_exists('email', $credentials);
        $isHasLogin = array_key_exists('login', $credentials);

        if (!$isHasPassword || !($isHasEmail || $isHasLogin)) {
            return false;
        }
    }
}
