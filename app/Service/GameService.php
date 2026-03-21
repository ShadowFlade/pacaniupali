<?php

namespace App\Service;

use App\Models\Player;
use App\Models\Winner;
use App\Modules\Games\Models\Game;

class GameService
{
    public function createGame(
        int    $groupId,
        string $dateTimeStart,
        string $dateTimeEnd,
        array  $players,
        int    $userWinnerId
    ): ?Game {
        $game = null;

        //todo:make it a transaction?
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
                    'user_id'       => $player['id'],
                    'points'        => $player['points'],
                    'is_host'       => $player['is_host'],
                    'game_id'       => $game->id,
                    'points_earned' => $player['points_earned'],
                    'points_lost'   => $player['points_lost'],
                    'right_answers' => $player['right_answers'],
                    'wrong_answers' => $player['wrong_answers'],

                ];
                return $playerArr;
            },
            $players
        );
        Player::insert($players);
        $playerWinner = Player::query()
                              ->where('game_id', $game->id)
                              ->where('user_id', $userWinnerId)
                              ->first();


        Winner::create(
            [
                'game_id'   => $game->id,
                'user_id'   => $userWinnerId,
                'player_id' => $playerWinner->id,

            ]
        );


        return $game;
    }

    /**
     * Мы берем последнюю игру, в которой записан его game_streak, смотрим, есть ли
     * между текущей игрой и последней победой (также это будет последняя игра с game_streak) игры,
     * если да, то считаем для этих игр game_streak, если нет, просто проставляем 0 или x+1,
     * где x это последний game_streak
     * @param int $userId
     * @return void
     */
    public function calcGameStreak(int $userId)
    {

    }
}
