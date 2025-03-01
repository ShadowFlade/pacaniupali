<?php

namespace Database\Seeders;

use App\Models\Game;
use App\Models\Group;
use App\Models\Player;
use App\Models\User;
use App\Models\UserGroup;
use App\Models\Winner;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //сначала надо создать одного юзера (зарегать себя) + одну группу (создать самому на /group)

        $myUser = User::create([
            'username' => 'ShadowFlade',
            'login' => 'ShadowFlade',
            'email' => env('PERSONAL_EMAIL','test@test.ru'),
            'email_verified_at' => now(),
            'password' => Hash::make(env('PERSONAL_PASSWORD','password')),
            'remember_token' => Str::random(10),
        ]);
        $myGroup = Group::create([
            'name' => 'Hawk Tuah',
            'description' => 'Hawk Tuah',
            'logo_path' => '/storage/group_logos/52ed226aae664c9a753ae3266cba9d24.jpeg24022025180914.jpeg',
            'code' => 'hawk_tuah'
        ]);

        UserGroup::create([
            'user_id' => $myUser->id,
            'group_id' => $myGroup->id,
        ]);



        User::factory()->count(10)->create();
        $groups = Group::orderBy('id', 'desc')->take(10)->get()->toArray();
        $users = User::orderBy('id', 'desc')->take(10)->get()->toArray();

        for ($i = 0; $i < 5; $i++) {
            $playerCount = random_int(3, 10);

            $game = Game::create([
                'game_start'    => date('Y-m-d H:i:s'),
                'game_end'      => date(
                    'Y-m-d H:i:s',
                    strtotime('+' . random_int(1, 3) . 'hour')
                ),
                'group_id'      => array_random($groups)['id'],
                'players_count' => $playerCount
            ]);

            $players = [];
            $userCount = 0;
            $usedUsers = [];
            for ($j = 0; $j < $playerCount; $j++) {
                $userCount++;
                $userRandomID = array_random($users)['id'];

                while (in_array($userRandomID, $usedUsers)) {
                    $userRandomID = array_random($users)['id'];
                }

                $player = Player::create([
                    'user_id' => $userRandomID,
                    'game_id' => $game->id,
                    'is_host' => $userCount == count($users),
                    'points'  => random_int(100, 10000),
                ]);
                $usedUsers[] = $userRandomID;
                $players[] = $player;
            }

            $winner = Winner::create([
                'game_id'   => $game->id,
                'player_id' => array_random($players)['id'],
            ]);
            unset($players);
            unset($usedUsers);
        }


    }
}
