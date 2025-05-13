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
        $playedWith = $this->getPlayedWithExceptGroupUsers();

        return ['played_with' => $playedWith, 'group_users' => $groupUsers];
    }

    public function getPlayedWithAddToGroup(int $limit = 10)
    {
        $groupUsers = $this->getGroupUsers();
        $playedWith = $this->getPlayedWithUsers();

        return ['played_with' => $playedWith, 'group_users' => $groupUsers];
    }

    public function getPlayedWithUsers(int $limit = 10)
    {
        $user = Auth::user();
//        $currentUserId = $user['id'];
        $currentUserId = 2;

        $playedWithIds = DB::table('players as p1')
            ->join('players as p2', 'p1.game_id', '=', 'p2.game_id')
            ->where('p1.user_id', '=', $currentUserId)
            ->where('p2.user_id', '!=', $currentUserId)
            ->distinct()
            ->pluck('p2.user_id');

        $playedWithUsers = \App\Models\User::whereIn('id', $playedWithIds)
            ->take($limit)
            ->get()
            ->keyBy('id')
            ->toArray();
        return $playedWithUsers;
    }

    public function getPlayedWithExceptGroupUsers(int $limit = 10)
    {
        $user = Auth::user();
//        $currentUserId = $user['id'];
        $currentUserId = 6;

        $playedWithIds = DB::table('players as p1')
            ->join('players as p2', 'p1.game_id', '=', 'p2.game_id')
            ->join('user_groups as ug1', 'p1.user_id', '=', 'ug1.user_id')
            ->join('user_groups as ug2', 'p2.user_id', '=', 'ug2.user_id')
            ->where('ug2.group_id', '!=', 'ug1.group_id')
            ->where('p1.user_id', '=', $currentUserId)
            ->where('p2.user_id', '!=', $currentUserId)
            ->distinct()
            ->pluck('p2.user_id');

        $playedWithUsers = \App\Models\User::whereIn('id', $playedWithIds)
            ->take($limit)
            ->get()
            ->keyBy('id')
            ->toArray();
        return $playedWithUsers;
    }

    public function getGroupUsers()
    {
        $user = Auth::user();


        $groupUsers = \App\Models\User::select('users.*')
            ->join('players', 'users.id', '=', 'players.user_id')
            ->join('user_groups', function($join) use ($user) {
                $join->on('user_groups.user_id', '=', 'players.user_id')
                    ->where('user_groups.user_id', $user->id);
            })
            ->distinct()
            ->get()
            ->keyBy('users.id');

        return $groupUsers->toArray();
    }

}
