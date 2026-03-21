'use client';

import AvatarSmall from '@/Components/AvatarSmall';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import General from '@/Layouts/General';
import { Link } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowLeft,
    ArrowUp,
    ArrowUpDown,
    Calendar,
    Gamepad2,
    Trophy,
    Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
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
    win_streak?: number | null;
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

function formatPlayerStat(
    value: number | null | undefined,
): string | number {
    if (value === null || value === undefined) {
        return '—';
    }
    return value;
}

function pointsTotalDisplay(p: GameDetailPlayer): string | number {
    return formatPlayerStat(p.points);
}

function pointsEarnedDisplay(p: GameDetailPlayer): string | number {
    return formatPlayerStat(p.points_earned);
}

type StatsSortKey =
    | 'name'
    | 'points'
    | 'points_earned'
    | 'points_lost'
    | 'right_answers'
    | 'wrong_answers'
    | 'win_streak';

type SortDir = 'asc' | 'desc';

function comparePlayers(
    a: GameDetailPlayer,
    b: GameDetailPlayer,
    key: StatsSortKey,
    dir: SortDir,
): number {
    let cmp = 0;
    if (key === 'name') {
        cmp = displayName(a).localeCompare(displayName(b), 'ru', {
            sensitivity: 'base',
        });
    } else {
        const get = (p: GameDetailPlayer): number | null | undefined => {
            switch (key) {
                case 'points':
                    return p.points;
                case 'points_earned':
                    return p.points_earned;
                case 'points_lost':
                    return p.points_lost;
                case 'right_answers':
                    return p.right_answers;
                case 'wrong_answers':
                    return p.wrong_answers;
                case 'win_streak':
                    return p.win_streak;
                default:
                    return null;
            }
        };
        const va = get(a);
        const vb = get(b);
        if (dir === 'asc') {
            const na = va ?? Number.POSITIVE_INFINITY;
            const nb = vb ?? Number.POSITIVE_INFINITY;
            cmp = na - nb;
        } else {
            const na = va ?? Number.NEGATIVE_INFINITY;
            const nb = vb ?? Number.NEGATIVE_INFINITY;
            cmp = nb - na;
        }
    }
    return cmp !== 0
        ? cmp
        : String(a.id).localeCompare(String(b.id), undefined, {
              numeric: true,
          });
}

function SortHeaderButton({
    label,
    sortKey,
    activeKey,
    dir,
    onSort,
    align,
    title,
}: {
    label: string;
    sortKey: StatsSortKey;
    activeKey: StatsSortKey | null;
    dir: SortDir;
    onSort: (key: StatsSortKey) => void;
    align: 'left' | 'right';
    title?: string;
}) {
    const active = activeKey === sortKey;
    const Icon = !active
        ? ArrowUpDown
        : dir === 'asc'
          ? ArrowUp
          : ArrowDown;
    return (
        <button
            type="button"
            title={title}
            onClick={() => onSort(sortKey)}
            className={
                align === 'left'
                    ? 'inline-flex w-full items-center justify-start gap-1 rounded px-0 py-0.5 text-left font-medium hover:text-foreground'
                    : 'inline-flex w-full items-center justify-end gap-1 rounded px-0 py-0.5 text-right font-medium hover:text-foreground'
            }
        >
            <span>{label}</span>
            <Icon
                className={
                    active ? 'h-3.5 w-3.5 shrink-0' : 'h-3.5 w-3.5 shrink-0 opacity-40'
                }
                aria-hidden
            />
        </button>
    );
}

export default function GameDetail({ game }: GameDetailProps) {
    const players = game.player ?? [];
    const [statsSortKey, setStatsSortKey] = useState<StatsSortKey | null>(null);
    const [statsSortDir, setStatsSortDir] = useState<SortDir>('asc');

    const handleStatsSort = (key: StatsSortKey) => {
        if (statsSortKey === key) {
            setStatsSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setStatsSortKey(key);
            setStatsSortDir('asc');
        }
    };

    const sortedPlayersForStats = useMemo(() => {
        if (!statsSortKey) {
            return players;
        }
        return [...players].sort((a, b) =>
            comparePlayers(a, b, statsSortKey, statsSortDir),
        );
    }, [players, statsSortKey, statsSortDir]);
    const winnerPlayer = game.winner
        ? players.find(
              (p) => String(p.id) === String(game.winner!.player_id),
          )
        : null;
    const winnerUser = winnerPlayer?.user;

    return (
        <General>
            <div className="container mx-auto max-w-7xl px-4 py-8">
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
                            {winnerUser && winnerPlayer ? (
                                <div className="space-y-4">
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
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border/60 pt-4 sm:grid-cols-3">
                                        <div>
                                            <dt
                                                className="text-muted-foreground text-xs"
                                                title="Всего очков набрано за игру"
                                            >
                                                Всего очков
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {pointsTotalDisplay(
                                                    winnerPlayer,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground text-xs">
                                                Очков заработано
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {pointsEarnedDisplay(
                                                    winnerPlayer,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground text-xs">
                                                Очков потеряно
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {formatPlayerStat(
                                                    winnerPlayer.points_lost,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground text-xs">
                                                Правильных
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {formatPlayerStat(
                                                    winnerPlayer.right_answers,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-muted-foreground text-xs">
                                                Неправильных
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {formatPlayerStat(
                                                    winnerPlayer.wrong_answers,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt
                                                className="text-muted-foreground text-xs"
                                                title="Стрик побед после игры"
                                            >
                                                Серия
                                            </dt>
                                            <dd className="font-medium tabular-nums">
                                                {formatPlayerStat(
                                                    winnerPlayer.win_streak,
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
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
                                            <th className="w-[20%] py-2 px-3 font-medium">
                                                <SortHeaderButton
                                                    label="Игрок"
                                                    sortKey="name"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="left"
                                                />
                                            </th>
                                            <th className="w-[11%] py-2 px-2 text-right font-medium">
                                                <SortHeaderButton
                                                    label="Всего очков"
                                                    sortKey="points"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="right"
                                                    title="Всего очков набрано за игру"
                                                />
                                            </th>
                                            <th className="w-[11%] py-2 px-2 text-right font-medium">
                                                <SortHeaderButton
                                                    label="Очков заработано"
                                                    sortKey="points_earned"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="right"
                                                />
                                            </th>
                                            <th className="w-[11%] py-2 px-2 text-right font-medium">
                                                <SortHeaderButton
                                                    label="Очков потеряно"
                                                    sortKey="points_lost"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="right"
                                                />
                                            </th>
                                            <th className="w-[11%] py-2 px-2 text-right font-medium">
                                                <SortHeaderButton
                                                    label="Правильных"
                                                    sortKey="right_answers"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="right"
                                                />
                                            </th>
                                            <th className="w-[11%] py-2 px-2 text-right font-medium">
                                                <SortHeaderButton
                                                    label="Неправильных"
                                                    sortKey="wrong_answers"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="right"
                                                />
                                            </th>
                                            <th className="w-[11%] py-2 px-2 text-right font-medium">
                                                <SortHeaderButton
                                                    label="Серия"
                                                    sortKey="win_streak"
                                                    activeKey={statsSortKey}
                                                    dir={statsSortDir}
                                                    onSort={handleStatsSort}
                                                    align="right"
                                                    title="Стрик побед после игры"
                                                />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedPlayersForStats.map((p) => (
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
                                                    {pointsTotalDisplay(p)}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {pointsEarnedDisplay(p)}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {formatPlayerStat(
                                                        p.points_lost,
                                                    )}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {formatPlayerStat(
                                                        p.right_answers,
                                                    )}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {formatPlayerStat(
                                                        p.wrong_answers,
                                                    )}
                                                </td>
                                                <td className="py-3 px-2 text-right">
                                                    {formatPlayerStat(
                                                        p.win_streak,
                                                    )}
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
