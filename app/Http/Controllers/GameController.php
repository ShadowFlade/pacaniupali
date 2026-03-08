<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGameRequest;
use App\Http\Requests\UpdateGameRequest;
use App\Models\Game;
use App\Service\GameService;
use Carbon\Carbon;
use Illuminate\Log\Logger;
use Illuminate\Support\Facades\Redirect;

class GameController extends Controller
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
        $dbFormat = config('datetime.formats.database');
        $gameStart = new \DateTime($request->input('game_start'));
        $gameStart = $gameStart->format($dbFormat);
        $gameEnd = new \DateTime($request->input('game_end'));
        $gameEnd = $gameEnd->format($dbFormat);
        $players = $request->input('players');
        $winnerId = $request->input('winner_id');
        $groupId = $request->input('group_id');
        \Illuminate\Support\Facades\Log::channel('single')->info(
            [$players]
        );

        $gameService = new GameService();
        $game = $gameService->createGame($groupId, $gameStart, $gameEnd, $players, $winnerId, $winnerId);

        return Redirect::back()->with([
            'data' => $game
        ]);
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
}
