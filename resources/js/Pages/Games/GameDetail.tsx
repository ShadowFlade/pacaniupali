'use client';

import AvatarSmall from '@/Components/AvatarSmall';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import General from '@/Layouts/General';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Gamepad2, Trophy, Users } from 'lucide-react';
import { format } from 'date-fns';
import { DATE_TIME_FORMAT } from '@/utility/const';
import { DEFAULT_AVATAR_PATH } from '@/utility/const';

type GameDetailPlayer = {
    id: number | string;
    user_id: number;
    user: {
        id: number;
        username?: string;
        login?: string;
        picture?: string;
    };
    points?: number | null;
    points_earned?: number | null;
    points_lost?: number | null;
    right_answers?: number | null;
    wrong_answers?: number | null;
    win_streak_at_game?: number | null;
};

type GameDetailData = {
    id: number | string;
    game_start: string;
    game_end?: string | null;
    group_id?: number | string;
    group?: { id: number | string; name?: string };
    player?: GameDetailPlayer[];
    winner?: { player_id: number | string };
};

type GameDetailProps = {
    auth?: { user?: { id: number } };
    game: GameDetailData;
};

function formatGameDate(value: string): string {
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : format(date, DATE_TIME_FORMAT);
    } catch {
        return value;
    }
}

function displayName(p: GameDetailPlayer): string {
    return p.user?.username ?? p.user?.login ?? String(p.user_id);
}

export default function GameDetail({ game }: GameDetailProps) {
    const players = game.player ?? [];
    console.log(game,' game');
    const winnerPlayer = game.winner
        ? players.find(
              (p) => String(p.id) === String(game.winner!.player_id),
          )
        : null;
    const winnerUser = winnerPlayer?.user;

    return (
        <General>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href={
                            game.group_id
                                ? route('group.detail', { id: game.group_id })
                                : route('game.index')
                        }
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {game.group_id ? 'К группе' : 'К списку игр'}
                    </Link>
                </div>

                {/* Дата игры */}
                <Card className="mb-6">
                    <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Дата игры
                            </p>
                            <p className="font-medium">
                                {formatGameDate(game.game_start)}
                                {game.game_end
                                    ? ` — ${formatGameDate(game.game_end)}`
                                    : ''}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="mb-6 grid gap-6 sm:grid-cols-2">
                    {/* Участники */}
                    <Card>
                        <CardHeader className="pb-2">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Users className="h-5 w-5" />
                                Участники
                            </h2>
                        </CardHeader>
                        <CardContent>
                            {players.length === 0 ? (
                                <p className="text-muted-foreground text-sm">
                                    Нет данных
                                </p>
                            ) : (
                                <ul className="space-y-3">
                                    {players.map((p) => (
                                        <li
                                            key={String(p.id)}
                                            className="flex items-center gap-3"
                                        >
                                            <AvatarSmall
                                                picture={
                                                    p.user?.picture ??
                                                    DEFAULT_AVATAR_PATH
                                                }
                                                username={displayName(p)}
                                            />
                                            <span className="font-medium">
                                                {displayName(p)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    {/* Победитель */}
                    <Card>
                        <CardHeader className="pb-2">
                            <h2 className="flex items-center gap-2 text-lg font-semibold">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Победитель
                            </h2>
                        </CardHeader>
                        <CardContent>
                            {winnerUser ? (
                                <div className="flex items-center gap-3">
                                    <AvatarSmall
                                        picture={
                                            winnerUser.picture ??
                                            DEFAULT_AVATAR_PATH
                                        }
                                        username={
                                            winnerUser.username ??
                                            winnerUser.login ??
                                            ''
                                        }
                                    />
                                    <span className="font-medium">
                                        {winnerUser.username ??
                                            winnerUser.login ??
                                            'Победитель'}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    Не указан
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Статистика по игрокам */}
                <Card>
                    <CardHeader className="pb-2">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Gamepad2 className="h-5 w-5" />
                            Статистика по игрокам
                        </h2>
                    </CardHeader>
                    <CardContent>
                        {players.length === 0 ? (
                            <p className="py-6 text-center text-muted-foreground text-sm">
                                Нет данных об участниках
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-md border border-border/60">
                                <table className="w-full table-fixed border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                                            <th className="w-[25%] py-2 px-3 font-medium">
                                                Игрок
                                            </th>
                                            <th className="w-[12%] py-2 px-2 text-right font-medium">
                                                Очков заработано
                                            </th>
                                            <th className="w-[12%] py-2 px-2 text-right font-medium">
                                                Очков потеряно
                                            </th>
                                            <th className="w-[12%] py-2 px-2 text-right font-medium">
                                                Правильных
                                            </th>
                                            <th className="w-[12%] py-2 px-2 text-right font-medium">
                                                Неправильных
                                            </th>
                                            <th className="w-[12%] py-2 px-2 text-right font-medium">
                                                Стрик побед
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.map((p) => (
                                            <tr
                                                key={String(p.id)}
                                                className="border-b border-border/60 last:border-0"
                                            >
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-2">
                                                        <AvatarSmall
                                                            picture={
                                                                p.user
                                                                    ?.picture ??
                                                                DEFAULT_AVATAR_PATH
                                                            }
                                                            username={
                                                                displayName(p)
                                                            }
                                                        />
                                                        <span className="font-medium">
                                                            {displayName(p)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {p.points_earned ??
                                                        p.points ??
                                                        '—'}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {p.points_lost ?? '—'}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {p.right_answers ?? '—'}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {p.wrong_answers ?? '—'}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {p.win_streak_at_game ?? '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </General>
    );
}
