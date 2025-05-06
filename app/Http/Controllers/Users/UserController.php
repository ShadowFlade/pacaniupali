<?php

namespace App\Http\Controllers\Users;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Game;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class UserController extends \App\Http\Controllers\Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\Illuminate\Http\Request $request)
    {

    }

    /**
     * Display the specified resource.
     */
    public function show(Game $game)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Game $game)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGameRequest $request, Game $game)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Game $game)
    {
        //
    }

    public function playedWithUsers(\Illuminate\Http\Request $request)
    {
        $user = Auth::user();
        $currentUserId = $user['id'];
        $playedWith = User::whereHas('players.game.players', function ($query) use ($currentUserId) {
            $query->where('user_id', '!=', $currentUserId)->where('user_id', $currentUserId);
        })
            ->distinct()
            ->get();

        return Redirect::back()->with(['data' => $playedWith]);


    }
}
