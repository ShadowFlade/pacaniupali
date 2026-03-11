<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Modules\UserGroup\Models\Group;
use App\Modules\UserGroup\Models\UserGroup;
use Illuminate\Support\Facades\Route;
use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Game;
use App\Service\GameService;
use Carbon\Carbon;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MainController extends Controller
{

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $publicGroups = Group::with(['users'])->public()->limit(10)->select(['*'])->get();

        return Inertia::render(
            'Welcome',
            [
                'canLogin'    => Route::has('login'),
                'canRegister' => Route::has('register'),
                'groups'      => $publicGroups
            ]
        );
    }
}
