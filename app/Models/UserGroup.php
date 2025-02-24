<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class UserGroup extends Model
{
    protected $table = 'user_groups';
    protected $fillable = [
        'user_id',
        'group_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class,'group_id');
    }
}
