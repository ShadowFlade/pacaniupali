<?php

namespace App\Service;

use App\Models\Group;

class UserGroupService
{
    public function deleteUsersFromGroup(int $groupId, array $userIds)
    {
        $deleteResult = \App\Models\UserGroup::query()
                                             ->where('group_id', $groupId)
                                             ->whereIn('user_id', $userIds)
                                             ->delete();
        return $deleteResult;

    }

    public function getGroupWithUsersAndWinners(int $groupId)
    {
        $group = Group::with(['users','users.wins'])
                      ->where('id', $groupId)
                      ->first()->toArray();

        foreach ($group['users'] as &$user) {
            $user['joined_group_at'] = $user['pivot']['created_at'];
            unset($user['pivot']);
        }
        return $group;
    }
}
