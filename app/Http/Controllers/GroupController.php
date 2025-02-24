<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Game;
use App\Models\Group;
use App\Models\Player;
use App\Models\User;
use App\Models\UserGroup;
use App\Models\Winner;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
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
        $groups = Group::query()
            ->join('user_groups', 'group_list.id', '=', 'user_groups.group_id')
            ->where('user_groups.user_id', $user['id'])
            ->get()->toArray();




        if(empty($groups)) {
            return Inertia::render('Group/GroupDetail', [
                'groups' => [],
            ]);
        }

        $games = Game::with(['player','winner'])
            ->where('games.group_id', $groups[0]['id'])
            ->get()->toArray();

        return Inertia::render('Group/GroupDetail', [
            'groups' => $groups,
            'games' => $games,
        ]);
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
    public function store(\Illuminate\Http\Request $request) : Response
    {
        $file = $request->file("logo");

        $ext = $file->extension();
        $logoFilename = $file->getClientOriginalName() . date('dmYHis') . "." . $ext;
        $file->storeAs('/group_logos', $logoFilename, 'public');

        $group = Group::create([
            'name'        => $request['name'],
            'code'        => str_slug($request['name']),
            'description' => $request['description'],
            'logo_path'   => '/storage/group_logos/' . $logoFilename,
        ]);

        $userGroup = UserGroup::create([
            'user_id'  => Auth::id(),
            'group_id' => $group['id'],
        ]);

        return Inertia::render('Group/GroupDetail',[
            'user_group' => $userGroup,
            'group' => $group,
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show()
    {

        $user = Auth::user();
        return Inertia::render('Group/GroupDetail');
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
