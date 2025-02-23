<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Models\Game;
use App\Models\Group;
use App\Models\User;
use App\Models\UserGroup;
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
        $userGroup = UserGroup::with(['User', 'Group'])
            ->where('user_id', $user['id'])
            ->get();

        return Inertia::render('Group/GroupDetail',[
            'user_group' => $userGroup,
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
        $ext = $file->getClientOriginalExtension();
        $logoFilename = $file->getClientOriginalName() . date('dmYHis') . "." . $ext;
        $file->storeAs('group_logos', $logoFilename, 'local');

        $group = Group::create([
            'name'        => $request['name'],
            'code'        => str_slug($request['name']),
            'description' => $request['description'],
            'logo_path'   => 'group_logos/' . $logoFilename,
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
