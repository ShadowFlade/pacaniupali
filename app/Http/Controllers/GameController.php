<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateGameRequest;
use App\Modules\Games\Models\Game;
use App\Modules\Games\Repository\GameRepository;
use App\Modules\Games\Services\GameService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

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
        $userId = $request->user()->id;
        $game = null;
        DB::transaction(function () use ($gameStart, $gameEnd, $players, $groupId, $userId, $gameService, $winnerId, &$game) {
            $game = $gameService->createGame($groupId, $gameStart, $gameEnd, $players, $winnerId);
            $gameService->calcGameStreakFull($userId);
        });


        return Redirect::back()->with([
            'data' => $game
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(int $gameId)
    {
        $repo = new GameRepository();
        $game = $repo->getGameWithPlayersById($gameId);
        return Inertia::render('Games/GameDetail', ['game' => $game]);
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
