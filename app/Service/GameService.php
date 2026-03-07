<?php

namespace App\Service;

use App\Models\Game;

class GameService
{
    public function createGame(
        int    $groupId,
        string $dateTimeStart,
        string $dateTimeEnd,
        array  $players,
        int    $playerWinnerId,
        int    $userWinnerId
    )
    {
        $game = Game::create(
            [
                'game_start'    => $dateTimeStart,
                'game_end'      => $dateTimeEnd,
                'group_id'      => $groupId,
                'players_count' => count($players),
            ]
        );
    }
}
