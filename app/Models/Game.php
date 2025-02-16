<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Game extends Model
{
    /** @use HasFactory<\Database\Factories\GameFactory> */
    use HasFactory;
    protected $fillable = [
        'winner_id',
        'game_id',
    ];
    public function winner() : HasOne
    {
        //TODO: hasOneThrough?
        return $this->hasOne(Winner::class);
    }

    public function players() : HasMany
    {
        return $this->hasMany(Player::class);
    }
}
