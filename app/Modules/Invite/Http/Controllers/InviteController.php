<?php

namespace App\Modules\Invite\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Invite\Http\Requests\InviteRequest;
use App\Modules\Invite\Models\Invite;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class InviteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = Auth::user()->id;
        $groupInvites = Invite::query()->with(['group'])->where('user_id', '=', $userId)->get()->all();
        return Inertia::render(
            'Invites/List',
            [
                'groupInvites' => $groupInvites,
                'friendRequests' => []
            ]
        );
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
    public function store(InviteRequest $request)
    {

        $fields = $request->all();
        $invite = Invite::create(
            [
                'user_id'  => $fields['user_id'],
                'group_id' => $fields['member_id'],
                'key'      => $fields['key'],
            ]
        );

        if ($invite) {
            return Redirect::back(301);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Invite $invite)
    {

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invite $invite)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invite $invite)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invite $invite)
    {
        //
    }
}
