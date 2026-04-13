<?php

namespace App\Service;

use App\Modules\UserGroup\Models\Group;

class UserGroupService
{
    public function deleteUsersFromGroup(int $groupId, array $userIds)
    {
        $deleteResult = \App\Modules\UserGroup\Models\UserGroup::query()
                                                               ->where('group_id', $groupId)
                                                               ->whereIn('user_id', $userIds)
                                                               ->delete();
        return $deleteResult;
    }


    public function getGroupWithUsersAndWinners(int $groupId)
    {
        $group = Group::query()->with(
            [
                'users.wins.game'    => function ($query) use ($groupId) {
                    $query->where('group_id', $groupId);
                },
                'users.groups.games' => function ($query) use ($groupId) {
                    $query->where('group_id', $groupId);
                },
            ])
                      ->where('id', $groupId)
                      ->first()->toArray();

        foreach ($group['users'] as &$user) {
            $user['joined_group_at'] = $user['pivot']['created_at'];
        }

        return $group;
    }
}
