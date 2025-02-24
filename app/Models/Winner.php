<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Winner extends Pivot
{
    protected $table = 'winners';
    public $incrementing = true;    // Отношение "один к одному" с игрой
    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    // Отношение "один к одному" с игроком
    public function player()
    {
        return $this->belongsTo(Player::class);
    }
}
