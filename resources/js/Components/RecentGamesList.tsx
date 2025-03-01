import type React from 'react';
import { DEFAULT_AVATAR_PATH } from '@/utility/const';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarList } from '@/Components/AvatarList';
import AvatarSmall from '@/Components/AvatarSmall';

export default function RecentGamesList({ games, currentUserID }) {
    return games.map((game) => {
        const yourPlayer = game.player && game.player.length && game.player.find((player) => player && player.user_id === currentUserID) || null;
        const userWinner = game.player.find(item => item.id == game.winner.player_id);
        console.log(userWinner, ' user winner');
        if (!game) return null;
        return (
            <table
                key={game.id}
                className=" p-2 rounded-lg bg-muted/50 w-full"
            >
                <thead className="headers text-left gap-4">
                <th className="w-[200px]">Начало игры</th>
                {game.winner && <th className="w-[200px]">Победитель</th>}
                {game.player && <th className="w-[300px]">Количество участников</th>}
                {game.player && <th>Участники</th>}
                {yourPlayer && <th>Ваша позиция</th>}
                {yourPlayer && <th>Ваши очки</th>}
                </thead>
                <tr className="row">
                    <td>{game.game_start}</td>
                    {game.winner &&
                        <td><span className="font-medium">
                            <AvatarSmall picture={userWinner.user.picture} username={userWinner.user.username} />
                        </span>
                        </td>}
                    {game.player && <td className="font-medium">{game.player.length}</td>}
                    {game.player &&
                        <td className="font-medium">
                            <AvatarList players={game.player}/>
                        </td>}
                    {yourPlayer && <td>{yourPlayer.position}</td>}
                    {yourPlayer && <td>{yourPlayer.points}</td>}
                </tr>


            </table>
        );
    });
}
