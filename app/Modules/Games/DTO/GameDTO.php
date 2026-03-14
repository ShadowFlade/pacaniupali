<?php

namespace App\Modules\Games\DTO;

class GameDTO
{
    public function __construct(
        public ?int    $id = 0,
        public ?string $game_start = null,
        public ?string $game_end = null,
        public ?array  $players = [],
        public ?array  $group = null,
    ) {
    }
}
