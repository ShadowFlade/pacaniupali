<?php

namespace App\Modules\Invite\Models;

use App\Modules\UserGroup\Models\Group;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Invite extends Model
{
    protected $table = 'invites';
    /** @use HasFactory<\Database\Factories\PlayerFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'group_id',
        'key',
    ];

    public function group(): HasOne
    {
        return $this->hasOne(Group::class);
    }
}
