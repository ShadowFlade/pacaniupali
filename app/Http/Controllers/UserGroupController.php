<?php

namespace App\Http\Controllers;

use App\Models\UserGroup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class UserGroupController extends Controller
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
    public function store(Request $request)
    {
        $groupId = $request->input('group_id');

        $newPlayers = [];

        $users = $request->input('players');

        $userIdsAlreadyInGroup = \App\Models\UserGroup::query()
                             ->where('group_id', $groupId)
                             ->whereIn('user_id',$users)
                             ->pluck('user_id')->toArray();

        $users = array_diff($users, $userIdsAlreadyInGroup);

        foreach ($users as $userId) {
            $resp = \App\Models\UserGroup::create(
                [
                    'user_id'  => $userId,
                    'group_id' => $groupId,
                ]
            );
            $newPlayers[] = $resp;
        }


        return $this->successResponse(['newUsers' => $newPlayers]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
