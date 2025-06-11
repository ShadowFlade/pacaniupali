<?php


namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    // ... other methods

    public function doLogin()
    {
        if (
            Auth::attempt(request()->only('email', 'password'))
            || Auth::attempt(request()->only('login', 'password'))
        ) {
//            return redirect('secret');
        }

        return back()->withErrors([
            'email' => 'invalid credentials',
        ]);
    }
}
