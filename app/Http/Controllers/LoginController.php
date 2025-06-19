<?php


namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // ... other methods

    public function doLogin()
    {
        $emailAttempt = Auth::attempt(request()->only('email', 'password'), true);
        $loginAttempt = Auth::attempt(request()->only('login', 'password'), true);
        if (
            $emailAttempt || $loginAttempt
        ) {
            dd(auth()->user());
            return redirect('dashboard');
        }

        return back()->withErrors([
            'email' => 'invalid credentials',
        ]);
    }
}
