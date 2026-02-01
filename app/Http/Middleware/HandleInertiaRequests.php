<?php

namespace App\Http\Middleware;

use Illuminate\Auth\GenericUser;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        if ($user instanceof GenericUser) {
            $userData = $user->getAttributes(); // This returns the raw array
        } else {
            $userData = $user; // Eloquent model — will serialize properly
        }
        return [
            ...parent::share($request),
            'csrf' => csrf_token(),
            'auth' => [
                'user' => $userData,
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
