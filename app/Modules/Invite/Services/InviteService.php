<?php

namespace App\Modules\Invite\Services;

use App\Modules\Invite\Models\Invite;
use Illuminate\Support\Facades\Auth;

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

    public function getPendingInvites(int $userId): array
    {
        $invites = Invite::query()
                         ->whereColumn('current_successful_attempts', '>=', 'max_successful_attempts')
                         ->orderBy('created_at', 'desc')
                         ->where('user_id', '=', $userId)
                         ->get();

        return $invites;
    }

    public function getOutgoingInvites(int $groupId): array
    {
        $invites = Invite::query()
                         ->where('group_id', '=', $groupId)
                         ->orderBy('created_at', 'desc')
                         ->get();

        return $invites;
    }
}
