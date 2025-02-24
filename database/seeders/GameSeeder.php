<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Player;
use App\Models\User;
use App\Models\Winner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::take(10)->get();

        for ($i = 0; $i < 5; $i++) {
            $game = Game::create([
                'game_start' => date('Y-m-d H:i:s'),
                'game_end'   => date(
                    'Y-m-d H:i:s',
                    strtotime('+' . random_int(1, 3) . 'hour')
                ),
                'group_id'   => 1
            ]);

            $players = [];
            foreach ($users as $user) {
                $player = Player::create([
                    'user_id' => $user['id'],
                    'game_id' => $game->id,
                    'is_host' => true,
                    'points'  => random_int(100, 10000),
                ]);
                $players[] = $player;

            }
            $winner = Winner::create([
                'game_id' => $game->id,
                'player_id' => array_rand($players)['id'],
            ]);
            unset($players);
        }


    }
}
