<?php

namespace App\Modules\UserGroup\Models;

use App\Models\User;
use App\Modules\Games\Models\Game;
use App\Modules\UserGroup\Enums\UserGroupPublicity;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    protected $table = 'group_list';

    /** @use HasFactory<\Database\Factories\GroupFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'logo_path',
        'code',
        'publicity',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_groups')->withTimestamps();
    }

    //    #[Scope]//todo:uncomment when updated to laravel12
     public function scopePublic(EloquentBuilder $query): void
     {
         $query->where('publicity', '=', UserGroupPublicity::PUBLIC);
     }

     public function games(): HasMany
     {
         return $this->hasMany(Game::class);
     }

}
