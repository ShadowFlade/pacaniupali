<?php

namespace App\Service;

use App\Models\Game;
use App\Models\Player;
use App\Models\Winner;
use Illuminate\Support\Facades\DB;

class GameService
{
    public function createGame(
        int    $groupId,
        string $dateTimeStart,
        string $dateTimeEnd,
        array  $players,
        int    $userWinnerId
    ): ?Game
    {
//        dd($players);
        $game = null;

//        DB::transaction(
//            function () use (&$game, $groupId, $dateTimeStart, $dateTimeEnd, $players, $userWinnerId, $playerWinnerId) {
        $game = Game::create(
            [
                'game_start'    => $dateTimeStart,
                'game_end'      => $dateTimeEnd,
                'group_id'      => $groupId,
                'players_count' => count($players),
            ]
        );
        $players = array_map(
            function ($player) use ($game) {
                $playerArr = [
                    'user_id' => $player['id'],
                    'points'  => $player['points'],
                    'is_host' => $player['is_host'],
                    'game_id' => $game->id,
                ];
                return $playerArr;
            },
            $players
        );
        Player::insert($players);
        $playerWinner = Player::query()
                              ->where('game_id', $game->id)
                              ->where('user_id',$userWinnerId)
                              ->first();


        Winner::create(
            [
                'game_id'   => $game->id,
                'user_id'   => $userWinnerId,
                'player_id' => $playerWinner->id,

            ]
        );
//            }
//        );

        return $game;
    }
}
