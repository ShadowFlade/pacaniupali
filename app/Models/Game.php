<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Game extends Model
{
    /** @use HasFactory<\Database\Factories\GameFactory> */
    use HasFactory;
    protected $fillable = [
        'winner_id',
        'game_id',
    ];
    public function winner() : BelongsTo
    {
        return $this->belongsTo(Winner::class);
    }

    public function player() : BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}
