<?php

namespace App\Models;

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
}
