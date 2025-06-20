<?php


namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{

    public function doLogin()
    {
//        dd(request());
        $emailAttempt = Auth::attempt(
            request()->only('email', 'password'),
            request()->boolean('remember')
        );
        $loginAttempt = Auth::attempt(
            request()->only('login', 'password'),
            request()->boolean('remember')
        );
        if (
            $emailAttempt || $loginAttempt
        ) {
            return redirect('dashboard');
        }

        return back()->withErrors([
            'email' => 'invalid credentials',
        ]);
    }
}
