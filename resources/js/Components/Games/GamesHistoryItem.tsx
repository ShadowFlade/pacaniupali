import { AvatarList } from '@/Components/AvatarList';
import AvatarSmall from '@/Components/AvatarSmall';
import { Card, CardContent } from '@/components/ui/card';
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
};

export type GameHistoryItemGroup = {
    logo_path?: string | null;
    name?: string;
};

type GameHistoryItemProps = {
    game: GameHistoryItemGame;
    group?: GameHistoryItemGroup | null;
};

function formatGameDate(value: string): string {
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : format(date, DATE_TIME_FORMAT);
    } catch {
        return value;
    }
}

export function GamesHistoryItem({ game, group }: GameHistoryItemProps) {
    const players = game.player ?? [];
    const winnerPlayer =
        game.winner &&
        players.find((p) => String(p.id) === String(game.winner!.player_id));
    const winnerUser = winnerPlayer?.user;

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Дата */}
                    <div className="shrink-0 text-sm text-muted-foreground">
                        {formatGameDate(game.game_start)}
                    </div>

                    {/* Количество участников */}
                    <div className="shrink-0 text-sm font-medium">
                        Участников: {players.length}
                    </div>

                    {/* Аватарки участников */}
                    <div className="min-w-0 shrink-0">
                        {players.length > 0 ? (
                            <AvatarList
                                players={players}
                                maxAvatars={6}
                                overlap={12}
                            />
                        ) : (
                            <span className="text-muted-foreground text-sm">
                                —
                            </span>
                        )}
                    </div>

                    {/* Победитель */}
                    <div className="flex shrink-0 items-center gap-2">
                        {winnerUser ? (
                            <>
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
                            </>
                        ) : (
                            <span className="text-muted-foreground text-sm">
                                Победитель не указан
                            </span>
                        )}
                    </div>

                    {/* Лого группы */}
                    {group?.logo_path && (
                        <div className="ml-auto shrink-0">
                            <img
                                src={group.logo_path || '/placeholder.svg'}
                                alt={group.name ? `${group.name} logo` : 'Group logo'}
                                className="h-10 w-10 rounded-lg object-cover"
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
