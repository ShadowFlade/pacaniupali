<?php

namespace App\Http\Controllers;

use App\Service\UserGroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
     * Добавляем/удаляем пользователей (юзеров) из группы
     * @param Request $request
     * @return JsonResponse
     */
    public function manage(Request $request): JsonResponse
    {

        $groupId = $request->input('group_id');
        $toDelete = $request->input('toDelete');
        $toAdd = $request->input('toAdd');
        $userGroupService = new UserGroupService();
        $newGroupMembers = [];
        $userIdsAlreadyInGroup = \App\Modules\UserGroup\Models\UserGroup::query()
                                                                        ->where('group_id', $groupId)
                                                                        ->whereIn('user_id', $toAdd)
                                                                        ->pluck('user_id')->toArray();

        $deleteResult = $userGroupService->deleteUsersFromGroup($groupId, $toDelete);


        $users = array_diff($toAdd, $userIdsAlreadyInGroup);

        foreach ($users as $userId) {
            $resp = \App\Modules\UserGroup\Models\UserGroup::create( // we are find with "slow' create - not mamny users will be (should be) created at once + we need returning record as they are added and. but if we really want to avoid this, we can use insert + additional query after that.
                [
                    'user_id'  => $userId,
                    'group_id' => $groupId,
                ]
            );
            $newGroupMembers[] = $resp;
        }


        return $this->successResponse(
            [
                'deleteResult'  => $deleteResult,
                'addedMembers' => $newGroupMembers,
            ]
        );
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
