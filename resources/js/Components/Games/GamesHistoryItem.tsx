import { AvatarList } from '@/Components/AvatarList';
import AvatarSmall from '@/Components/AvatarSmall';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { DATE_TIME_FORMAT } from '@/utility/const';

export type GamePlayer = {
    id: number;
    user_id: number;
    user: {
        id: number;
        username?: string;
        login?: string;
        picture?: string;
    };
};

export type GameWinner = {
    player_id: number;
};

export type GameHistoryItemGame = {
    id: number | string;
    game_start: string;
    player?: GamePlayer[];
    winner?: GameWinner;
    players_count: number;
};

export type GameHistoryItemGroup = {
    logo_path?: string | null;
    name?: string;
};

type GameHistoryItemProps = {
    game: GameHistoryItemGame;
    group?: GameHistoryItemGroup | null;
    editable?: boolean;
    onDeleteGame?: (id: number | string) => void;
};

function formatGameDate(value: string): string {
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : format(date, DATE_TIME_FORMAT);
    } catch {
        return value;
    }
}

export function GamesHistoryItem({
    game,
    group,
    editable,
    onDeleteGame,
}: GameHistoryItemProps) {
    const players = game.player ?? [];
    console.log(game,' game');
    const winnerPlayer =
        game.winner &&
        players.find((p) => String(p.id) === String(game.winner!.player_id));
    const winnerUser = winnerPlayer?.user;

    return (
        <tr className="border-b border-border/60 last:border-0">
            <td className="whitespace-nowrap py-3 pr-4 text-sm text-muted-foreground">
                <Link
                    href={`/game/${game.id}`}
                    className="hover:text-foreground hover:underline"
                >
                    {formatGameDate(game.game_start)}
                </Link>
            </td>
            <td className="w-24 py-3 pr-4 text-sm font-medium">
                {players.length ?? game.players_count}
            </td>
            <td className="py-3 pr-4">
                {players.length > 0 ? (
                    <AvatarList
                        players={players}
                        maxAvatars={5}
                        overlap={12}
                    />
                ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                )}
            </td>
            <td className="py-3 pr-4">
                {winnerUser ? (
                    <div className="flex items-center gap-2">
                        <AvatarSmall
                            picture={winnerUser.picture}
                            username={
                                winnerUser.username ??
                                winnerUser.login ??
                                ''
                            }
                        />
                        <span className="text-sm font-medium">
                            {winnerUser.username ??
                                winnerUser.login ??
                                'Победитель'}
                        </span>
                    </div>
                ) : (
                    <span className="text-muted-foreground text-sm">
                        Победитель не указан
                    </span>
                )}
            </td>
            {editable && (
                <td className="w-24 py-3 pr-2 text-right">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="shake-soft text-destructive hover:text-destructive"
                        onClick={() => onDeleteGame?.(game.id)}
                    >
                        Удалить
                    </Button>
                </td>
            )}
        </tr>
    );
}
