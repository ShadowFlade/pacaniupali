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
        $group = Group::with(['users.wins.game'])
                      ->where('id', $groupId)
                      ->first()->toArray();

        foreach ($group['users'] as &$user) {
            $user['joined_group_at'] = $user['pivot']['created_at'];
            unset($user['pivot']);
            foreach ($user['wins'] as $winKey => &$win) {
                if (!is_null($win['game']) && $group['id'] != $win['game']['group_id']) {
                    unset($user['wins'][$winKey]);
                }
            }
        }
        return $group;
    }
}
