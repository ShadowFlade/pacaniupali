<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Group extends Model
{
    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'logo_path',
        'code'
    ];

    public function users(): HasManyThrough
    {
        return $this->hasManyThrough(User::class,UserGroup::class);
    }
}
