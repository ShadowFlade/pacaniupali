<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Http\Requests\UserAdvancedUpdateRequest;
use App\Models\Game;
use App\Models\Group;
use App\Models\Player;
use App\Models\User;
use App\Models\UserGroup;
use App\Models\Winner;
use App\Service\UserGroupService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        $groups = Group::with(['users'])
                       ->whereRelation(
                           'users',
                           'user_id',
                           '=',
                           $user->id
                       )
                       ->get()
                       ->toArray();

        if (empty($groups)) {
            return Inertia::render(
                'Group/GroupList',
                [
                    'groups'   => [],
                    'creating' => request()->has('creating'),
                    'auth'     => ['user' => $user]
                ]
            );
        }

        $games = Game::with(['player', 'winner', 'player.user'])
                     ->where('games.group_id', $groups[0]['id'])
                     ->get()->toArray();


        return Inertia::render(
            'Group/GroupList',
            [
                'groups'     => $groups,
                'games'      => $games,
                'many_games' => [],
                'auth'       => ['user' => request()->user()]
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create($params)
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(\Illuminate\Http\Request $request): RedirectResponse
    {
        $file = $request->file("logo");
        $logoFilename = null;

        if ($file) {
            $ext = $file->extension();
            $logoFilename = hash('sha256', time() . uniqid()) . "." . $ext;
            $file->storeAs('/group_logos', $logoFilename, 'public');
        }

        $newGroup = [
            'name'        => $request['name'],
            'code'        => str_slug($request['name']),
            'description' => $request['description'],
            'logo_path'   => '/storage/group_logos/' . $logoFilename
        ];

        $group = Group::create($newGroup);

        $userGroup = UserGroup::create(
            [
                'user_id'  => Auth::id(),
                'group_id' => $group['id'],
            ]
        );

        return Redirect::back(301);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $groupId)
    {
        $user = Auth::user();

        $userGroupService = new UserGroupService();
        $group = $userGroupService->getGroupWithUsersAndWinners($groupId);

        $games = Game::with(['player', 'winner', 'player.user'])
                     ->where('group_id', $groupId)
                     ->get()
                     ->toArray();


        $auth = auth();
        $winnerPlayer = null;

        foreach ($games as $game) {
            $players = [];
            foreach ($game['player'] as $player) {
                $players[$player['user_id']] = $player;
            }
            $game['player'] = $players;
            $game['winner']['username'] = $game['player'][$player['user_id']]['user']['username'];
        }

        return Inertia::render(
            'Group/GroupDetail',
            [
                'group' => $group,
                'games' => $games,
                'auth'  => $auth
            ]
        );
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        //
    }
}
