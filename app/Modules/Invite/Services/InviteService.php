<?php

namespace App\Modules\Invite\Services;

use App\Modules\Invite\Models\Invite;

class InviteService
{
    public function generateInviteKey(): string
    {
        $prefix = 'group_invite';
        $key = $prefix . bin2hex(random_bytes(24));

        return $key;
    }

    public function create(int $groupId, int $userId): Invite
    {
        $createdInvite = Invite::create(
            [
                'group_id' => $groupId,
                'user_id'  => $userId,
                'key'      => $this->generateInviteKey(),
            ]);

        return $createdInvite;
    }
}
