<?php

namespace App\Service;

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
}
