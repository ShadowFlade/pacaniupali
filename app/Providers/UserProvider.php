<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Auth\GenericUser;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Illuminate\Contracts\Hashing\Hasher as HasherContract;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Auth\UserProvider as BaseUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;

class UserProvider implements BaseUserProvider
{
    /**
     * The active database connection.
     *
     * @var \Illuminate\Database\ConnectionInterface
     */
    protected $connection;

    /**
     * The hasher implementation.
     *
     * @var \Illuminate\Contracts\Hashing\Hasher
     */
    protected $hasher;

    /**
     * The table containing the users.
     *
     * @var string
     */
    protected $table;

    /**
     * Create a new database user provider.
     *
     * @param  \Illuminate\Database\ConnectionInterface  $connection
     * @param  \Illuminate\Contracts\Hashing\Hasher  $hasher
     * @param  string  $table
     * @return void
     */
    public function __construct(ConnectionInterface $connection, HasherContract $hasher, $table)
    {
        $this->connection = $connection;
        $this->table = $table;
        $this->hasher = $hasher;
    }

    public function retrieveById($identifier)
    {
        $user = $this->connection->table($this->table)->find($identifier);
        return $this->getGenericUser($user);
    }

    /**
     * Get the generic user.
     *
     * @param mixed $user
     * @return \Illuminate\Auth\GenericUser|null
     */
    protected function getGenericUser($user)
    {
        if (!is_null($user)) {
            return new GenericUser((array)$user);
        }
    }

    public function retrieveByToken($identifier, $token)
    {
        $user = $this->getGenericUser(
            $this->connection->table($this->table)->find($identifier)
        );

        return $user && $user->getRememberToken() && hash_equals($user->getRememberToken(), $token)
            ? $user : null;
    }

    public function updateRememberToken(Authenticatable $user, $token)
    {
        $this->connection->table($this->table)
            ->where($user->getAuthIdentifierName(), $user->getAuthIdentifier())
            ->update([$user->getRememberTokenName() => $token]);
    }

    public function retrieveByCredentials(array $credentials)
    {
//        dd($credentials);
        if ($this->isCredentialsValid($credentials) === false) {
            return null;
        }
//        $credentials['password'] = Hash::make($credentials['password']);
        $identifier = $credentials['email'] ?? $credentials['login'] ?? null;

        if (isset($credentials['email'])) {
            $userData = User::query()
                ->where('email', '=', $credentials['email'])
                ->get()
                ->toArray();
        } else if (isset($credentials['login'])) {
            $userData = User::query()
                ->where('login', '=', $credentials['login'])
                ->get()
                ->toArray();
        }
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
        $userData['id'] = $identifier;
        $genUser = new GenericUser($userData);
        return $genUser;
//        }

    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
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
