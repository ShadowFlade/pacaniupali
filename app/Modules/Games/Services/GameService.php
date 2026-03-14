<?php

namespace App\Modules\Games\Services;

use App\Modules\Games\Repository\GameRepository;

class GameService
{
    public function getGameWithPlayersById(int $id)
    {
        $repo = new GameRepository();
        $game = $repo->getGameWithPlayersById($id);

        //implement setting game streak (actually shoudl do it on game add)
        return $game;
    }
}
