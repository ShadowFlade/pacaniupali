<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Player extends Model
{
    /** @use HasFactory<\Database\Factories\PlayerFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'game_id',
        'is_host',
        'points'
    ];
    protected $appends = ['position'];


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }


    //TODO: разница между hasOne и belongsTo ??
    public function winner()
    {
        return $this->hasOne(Winner::class);
    }

    public function getPositionAttribute()
    {
        return DB::table('players as p')
                ->where('p.game_id', $this->game_id)
                ->where('p.points', '>', $this->points)
                ->count() + 1;
    }


}
