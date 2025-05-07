<?php

namespace App\Service;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class User
{

    public function getPlayedWith(int $limit = 10)
    {
        $groupUsers = $this->getGroupUsers();
        $playedWith = $this->getPlayedWithUsers();
        $users = array_merge($groupUsers, $playedWith);
        return $users;


    }

    public function getPlayedWithUsers(int $limit = 10)
    {
        $user = Auth::user();
        $currentUserId = $user['id'];
        $playedWithIds = DB::table('players as p1')
            ->join('players as p2', 'p1.game_id', '=', 'p2.game_id')
            ->where('p1.user_id', $user['id'])
            ->where('p2.user_id', '!=', $currentUserId)
            ->distinct()
            ->pluck('p2.user_id');
        $playedWithUsers = \App\Models\User::whereIn('id', $playedWithIds)->take($limit)->get()->toArray()->keyBy('id');

        return $playedWithUsers;
    }

    public function getGroupUsers()
    {
        $user = Auth::user();

        $groupUsers = \App\Models\User::select('users.*')
            ->join('players', 'users.id', '=', 'players.user_id')
            ->join('user_groups', function($join) use ($user) {
                $join->on('user_groups.game_id', '=', 'players.game_id')
                    ->where('user_groups.user_id', $user->id);
            })
            ->distinct()
            ->get()
            ->keyBy('id');  // Automatically keys collection by ID

        return $groupUsers->toArray();
    }

}
