<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserGroup extends Pivot
{
    protected $table = 'user_groups';
    protected $fillable = [
        'user_id',
        'group_id',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}
