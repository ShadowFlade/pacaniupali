<?php

namespace App\Models;

use App\Modules\Games\Models\Game;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Winner extends Pivot
{
    protected $table = 'winners';
    public $incrementing = true;
    public function game()
    {
        return $this->belongsTo(Game::class);
    }


    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
