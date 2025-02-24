import type React from 'react';

export default function RecentGamesList({ games, currentUserID, groupID }) {
    console.log(groupID, ' GROUP ID');
    console.log(games, ' games');
    return games.map((game) => {

        const yourPlayer = game.player && game.player.length && game.player.find((player) => player && player.user_id === currentUserID) || null;
        console.log(game, ' GAME');
        if (!game) return null;
        return (
            <table
                key={game.id}
                className=" p-2 rounded-lg bg-muted/50 w-full"
            >
                <thead className="headers text-left gap-4">
                    <th>Начало игры</th>
                    {game.winner && <th>Победитель</th>}
                    {game.player && <th>Количество участников</th>}
                    {game.player && <th>Участники</th>}
                    {yourPlayer && <th>Ваша позиция</th>}
                    {yourPlayer && <th>Ваши очки</th>}
                </thead>
                <tr className="row">
                    <td>{game.game_start}</td>
                    {game.winner && <td><span className="font-medium">{game.winner.user_id}</span> </td>}
                    {game.player && <td className="font-medium">{game.player.length}</td>}
                    {game.player &&
                        <td className="font-medium">{game.player.map(player => player.id).join(',')}</td>}
                    {yourPlayer && <td>{yourPlayer.position}</td>}
                    {yourPlayer && <td>{yourPlayer.points}</td>}
                </tr>


            </table>
        );
    });
}
