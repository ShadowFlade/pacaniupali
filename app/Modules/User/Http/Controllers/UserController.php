<?php

namespace App\Modules\User\Http\Controllers;

use App\Http\Requests\UpdateGameRequest;
use App\Http\Requests\UserSearchRequest;
use App\Models\Player;
use App\Models\User;
use App\Modules\Games\Models\Game;
use App\Service\UserGroupService;
use Inertia\Inertia;

class UserController extends \App\Http\Controllers\Controller
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

    }

    /**
     * Display the specified resource.
     */
    public function show(int $userId)
    {
        $games = Player::with(['winner'])->where('user_id', $userId)->select(['*'])->get();
        $auth = auth();
        $user = $auth->user();
        $winCount = array_reduce(
            $games->toArray(), function ($carry, $game) {
            return $game ? 1 : 0 + $carry;
        },  0);
        $userService = new \App\Service\User();
        $limit = 3;
        $playedWithStat = $userService->getPlayedWithMostStat($userId, $limit);
        $userIds = array_map(
            function ($item) {
                return $item['opponent_id'];
            },
            $playedWithStat->toArray()
        );
        $opponents = $playedWithStat->keyBy('opponent_id')->toArray();

        $users = User::query()
                     ->whereIn('id', $userIds)
                     ->get()
                     ->keyBy('id')
                     ->toArray();

        foreach ($opponents as $key => $opponent) {
            if (isset($users[$opponent['opponent_id']])) {
                $opponents[$key]['user'] = $users[$opponent['opponent_id']];
            }
        }


        $winRate = $winCount / $games->count();
        $resp = [
            'games'            => $games,
            'auth'             => auth(),
            'user'             => $user,
            'summary'          => [
                'games_played' => $games->count(),
                'wins'         => $winCount,
                'win_rate'     => $winRate,
            ],
            'most_played_with' => $opponents,
        ];

        return Inertia::render('Users/UserDetail', $resp);
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

    /**
     * Также сюда включаются юзеры из твоей группы
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function playedWithUsers(\Illuminate\Http\Request $request)
    {
        $userService = new \App\Service\User();
        $userId = $request->user()->id;
        $users = $userService->getPlayedWith($userId);
        return response()->json($users);
    }

    public function searchByUserName(UserSearchRequest $request)
    {
        $text = $request->input('text');
        $limit = (int)$request->input('limit', 20);
        $offset = (int)$request->input('offset', 0);

        $query = User::query()->select(['username', 'id'])->orderBy('username');

        if ($text !== null && $text !== '') {
            $query->orWhereLike('username', "%{$text}%");
        }

        $users = $query->offset($offset)->limit($limit)->get()->all();

        return response()->json($users);
    }
}
