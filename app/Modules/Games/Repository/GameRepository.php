<?php

namespace App\Modules\Games\Repository;

use App\Modules\Games\Models\Game;

class GameRepository
{
    public function getGameWithPlayersById(int $id)
    {
        $game = Game::with(['player', 'player.user', 'winner'])
                    ->orderByDesc('games.game_start')
                    ->findOrFail($id);
        return $game;
    }
}
