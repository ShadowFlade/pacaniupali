<?php

namespace App\Service;

use App\Models\Player;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class User
{
    public function getPlayedWith(int $userId, int $limit = 10)
    {
        $groupUsers = $this->getGroupUsers();
        $playedWith = $this->getPlayedWithExceptGroupUsers($userId);

        return ['played_with' => $playedWith, 'group_users' => $groupUsers];
    }

    public function getPlayedWithAddToGroup(int $userId, int $limit = 10)
    {
        $groupUsers = $this->getGroupUsers();
        $playedWith = $this->getPlayedWithUsers($userId);

        return ['played_with' => $playedWith, 'group_users' => $groupUsers];
    }

    public function getPlayedWithMostStat(int $userId, int $limit): Collection
    {
        // todo[revisit]: revisit later if i understand this lol
        $opponents = Player::from('players as me')
            ->join(
                'players as opponent',
                function ($join) {
                    $join->on('me.game_id', '=', 'opponent.game_id')
                        ->on('me.user_id', '!=', 'opponent.user_id');
                }
            )
            ->where('me.user_id', $userId)
            ->select(
                'opponent.user_id as opponent_id',
                DB::raw('COUNT(*) as times_played_together')
            )
            ->groupBy('opponent.user_id')
            ->orderByDesc('times_played_together')
            ->limit($limit)
            ->get();

        return $opponents;
    }

    public function getMostWinsAgainst(int $userId, int $limit): Collection
    {
        // todo[revisit]:в каком порядке выполняются?
        $mostWinsAgainst = Player::query()
            ->from('players as me')
            ->join('winners as w', 'w.user_id', '=', 'me.user_id')
            ->join('players as opponent', function ($join) {
                $join->on('me.user_id', '!=', 'opponent.user_id')
                    //                     $join->on('me.game_id', '=', 'opponent.game_id')
                    ->on('w.game_id', '=', 'opponent.game_id');
            })
            ->where('me.user_id', '=', $userId)
            ->where('w.user_id', '=', $userId)
            ->select(
                'opponent.user_id as opponent_id',
                DB::raw('COUNT(*) as times_played_together')
            )
            ->groupBy('opponent.user_id')
            ->orderByDesc('times_played_together')
            ->limit($limit)
            ->get();

        return $mostWinsAgainst;
    }

    public function getPlayedWithUsers(int $userId, int $limit = 10)
    {
        $currentUserId = $userId;

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

    public function getPlayedWithExceptGroupUsers(int $userId, int $limit = 10)
    {
        $currentUserId = $userId;

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
            ->join(
                'user_groups',
                function ($join) use ($user) {
                    $join->on('user_groups.user_id', '=', 'players.user_id')
                        ->where('user_groups.user_id', $user->id);
                }
            )
            ->distinct()
            ->get()
            ->keyBy('users.id');

        return $groupUsers->toArray();
    }
}
