'use client';

import AvatarSmall from '@/Components/AvatarSmall';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import General from '@/Layouts/General';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    Gamepad2,
    Skull,
    Target,
    Trophy,
    Users,
} from 'lucide-react';
import { format } from 'date-fns';
import { useMemo, type ComponentType } from 'react';
import { DATE_TIME_FORMAT } from '@/utility/const';
import { DEFAULT_AVATAR_PATH } from '@/utility/const';

/** Публичные поля пользователя (как отдаст бэкенд с UserDetail) */
export type UserDetailProfile = {
    id: number;
    username?: string | null;
    login?: string | null;
    picture?: string | null;
};

export type UserDetailSummary = {
    games_played: number;
    wins: number;
    /** Процент побед среди игр с известным исходом, или null */
    win_rate: number | null;
};

export type UserDetailGameRow = {
    id: number;
    /** Дата игры / записи (с бэка: `created_at` или `createdAt`) */
    created_at: string;
    group?: { id: number; name?: string } | null;
    won?: boolean | null;
    my_points?: number | null;
};

export type UserStatPartner = {
    user: UserDetailProfile;
    count: number;
};

export type UserDetailPageProps = {
    auth?: { user?: { id: number } };
    user: UserDetailProfile;
    summary?: UserDetailSummary;
    games?: UserDetailGameRow[];
    most_played_with?: UserStatPartner[];
    most_won_against?: UserStatPartner[];
    most_lost_to?: UserStatPartner[];
};

function displayUserName(u: UserDetailProfile): string {
    return u.username ?? u.login ?? `User #${u.id}`;
}

function formatGameDate(value: string | null | undefined): string {
    if (value == null || value === '') {
        return '—';
    }
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? String(value) : format(date, DATE_TIME_FORMAT);
    } catch {
        return String(value);
    }
}

export type LegacyGroup = { id: number; name?: string | null };

/** Ответ бэка: либо уже `UserDetailGameRow`, либо `Player` с `game`, у `game` бывает `user.groups[]` */
type LegacyPlayerGamePayload = {
    id?: number;
    game_id?: number;
    points?: number | null;
    my_points?: number | null;
    won?: boolean | null;
    winner?: Record<string, unknown> | null;
    created_at?: string;
    createdAt?: string;
    group?: LegacyGroup | null;
    /** У записи Player свой user с группами */
    user?: {
        groups?: LegacyGroup[] | null;
    };
    game?: {
        id?: number;
        group_id?: number | null;
        created_at?: string;
        createdAt?: string;
        /** Например связь game.user с groups */
        user?: {
            groups?: LegacyGroup[] | null;
        };
        group?: LegacyGroup | null;
        group_list?: LegacyGroup | null;
    };
};

function toLegacyGroup(raw: unknown): LegacyGroup | null {
    if (!raw || typeof raw !== 'object' || !('id' in raw)) {
        return null;
    }
    const o = raw as LegacyGroup;
    return { id: Number(o.id), name: o.name ?? undefined };
}

/** Группа игры: из `game.user.groups` (массив), при необходимости по `game.group_id`, и запасные поля */
function pickGroupFromGamePayload(
    item: LegacyPlayerGamePayload,
): LegacyGroup | null {
    const g = item.game;
    const fromScalar =
        toLegacyGroup(g?.group) ??
        toLegacyGroup(g?.group_list) ??
        toLegacyGroup(item.group);

    const groups = g?.user?.groups ?? item.user?.groups;
    if (!Array.isArray(groups) || groups.length === 0) {
        return fromScalar;
    }

    const gid = g?.group_id;
    if (gid != null && gid !== '') {
        const match = groups.find((x) => Number(x?.id) === Number(gid));
        if (match) {
            return toLegacyGroup(match) ?? fromScalar;
        }
    }

    return toLegacyGroup(groups[0]) ?? fromScalar;
}

function pickCreatedAt(item: LegacyPlayerGamePayload): string {
    const g = item.game;
    return (
        g?.created_at ??
        g?.createdAt ??
        item.created_at ??
        item.createdAt ??
        ''
    );
}

function normalizeGameHistory(raw: unknown): UserDetailGameRow[] {
    if (!Array.isArray(raw)) {
        return [];
    }

    return raw.map((item: LegacyPlayerGamePayload & Partial<UserDetailGameRow>) => {
        const g = item.game;
        const gameId = Number(g?.id ?? item.game_id ?? 0);
        const rowId = Number(item.id ?? gameId);

        const createdAt = pickCreatedAt(item);

        const grp = pickGroupFromGamePayload(item);
        const group = grp ? { id: grp.id, name: grp.name ?? undefined } : null;

        let won: boolean | null = null;
        if (typeof item.won === 'boolean') {
            won = item.won;
        } else if (item.winner != null && typeof item.winner === 'object') {
            won = Object.keys(item.winner).length > 0;
        }

        const myPoints =
            item.my_points != null ? item.my_points : item.points;

        return {
            id: gameId || rowId,
            created_at: createdAt,
            group,
            won,
            my_points:
                myPoints !== undefined && myPoints !== null
                    ? Number(myPoints)
                    : null,
        };
    });
}

function historySortKey(row: UserDetailGameRow): number {
    if (!row.created_at) {
        return row.id;
    }
    const t = new Date(row.created_at).getTime();
    return isNaN(t) ? row.id : t;
}

function resultLabel(won: boolean | null | undefined): string {
    if (won === true) return 'Победа';
    if (won === false) return 'Поражение';
    return '—';
}

function resultClass(won: boolean | null | undefined): string {
    if (won === true) return 'text-emerald-600 dark:text-emerald-400';
    if (won === false) return 'text-destructive';
    return 'text-muted-foreground';
}

function StatPartnersCard({
    title,
    icon: Icon,
    items,
    emptyText,
}: {
    title: string;
    icon: ComponentType<{ className?: string }>;
    items: UserStatPartner[];
    emptyText: string;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Icon className="h-5 w-5 shrink-0 text-primary" />
                    {title}
                </h2>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <p className="text-muted-foreground text-sm">{emptyText}</p>
                ) : (
                    <ul className="space-y-3">
                        {items.map(({ user: u, count }, i) => (
                            <li
                                key={u.id}
                                className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                            >
                                <div className="flex min-w-0 items-center gap-2">
                                    <span className="text-muted-foreground w-6 shrink-0 text-sm tabular-nums">
                                        {i + 1}.
                                    </span>
                                    <AvatarSmall
                                        picture={
                                            u.picture ?? DEFAULT_AVATAR_PATH
                                        }
                                        username={displayUserName(u)}
                                    />
                                    <Link
                                        href={route('user.show', u.id)}
                                        className="truncate font-medium hover:underline"
                                    >
                                        {displayUserName(u)}
                                    </Link>
                                </div>
                                <span className="text-muted-foreground shrink-0 tabular-nums text-sm">
                                    ×{count}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}

export default function UserDetail({
    user,
    summary = {
        games_played: 0,
        wins: 0,
        win_rate: null,
    },
    games = [],
    most_played_with = [],
    most_won_against = [],
    most_lost_to = [],
}: UserDetailPageProps) {
    const name = displayUserName(user);
    console.log(games,' games');
    const historyRows = useMemo(() => {
        return [...normalizeGameHistory(games as unknown)].sort(
            (a, b) => historySortKey(b) - historySortKey(a),
        );
    }, [games]);

    return (
        <General>
            <div className="container mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6">
                    <Link
                        href={route('group.index')}
                        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Назад
                    </Link>
                    <div className="flex flex-wrap items-center gap-4">
                        <AvatarSmall
                            picture={user.picture ?? DEFAULT_AVATAR_PATH}
                            username={name}
                        />
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {name}
                            </h1>
                            {user.login && user.username !== user.login ? (
                                <p className="text-muted-foreground text-sm">
                                    {user.login}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Сводка */}
                <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Gamepad2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">
                                    Игр сыграно
                                </p>
                                <p className="text-xl font-semibold tabular-nums">
                                    {summary.games_played}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/15">
                                <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">
                                    Побед
                                </p>
                                <p className="text-xl font-semibold tabular-nums">
                                    {summary.wins}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <BarChart3 className="text-muted-foreground h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">
                                    % побед *
                                </p>
                                <p className="text-xl font-semibold tabular-nums">
                                    {summary.win_rate != null
                                        ? `${summary.win_rate.toString().slice(0,10)}%`
                                        : '—'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <p className="text-muted-foreground mb-6 text-xs">
                    * Доля побед считается только по играм, где исход известен
                    (победа или поражение).
                </p>

                {/* Топы по соперникам */}
                <div className="mb-6 grid gap-6 lg:grid-cols-3">
                    <StatPartnersCard
                        title="С кем чаще играл"
                        icon={Users}
                        items={most_played_with}
                        emptyText="Пока нет совместных игр."
                    />
                    <StatPartnersCard
                        title="Кого чаще обыгрывал"
                        icon={Target}
                        items={most_won_against}
                        emptyText="Нет побед над соперниками в общих играх."
                    />
                    { /*<StatPartnersCard title="Кому чаще проигрывал" icon={Skull} items={most_lost_to} emptyText="Нет поражений с известным победителем." /> */}
                </div>

                {/* История игр */}
                <Card>
                    <CardHeader className="pb-2">
                        <h2 className="flex items-center gap-2 text-lg font-semibold">
                            <Calendar className="h-5 w-5" />
                            История игр
                        </h2>
                    </CardHeader>
                    <CardContent>
                        {historyRows.length === 0 ? (
                            <p className="text-muted-foreground py-8 text-center text-sm">
                                Нет сыгранных игр.
                            </p>
                        ) : (
                            <div className="overflow-x-auto rounded-md border border-border/60">
                                <table className="w-full table-fixed border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                                            <th className="w-[28%] py-2 px-3 font-medium">
                                                Дата
                                            </th>
                                            <th className="w-[22%] py-2 px-2 font-medium">
                                                Группа
                                            </th>
                                            <th className="w-[14%] py-2 px-2 text-right font-medium">
                                                Очки
                                            </th>
                                            <th className="w-[16%] py-2 px-2 text-center font-medium">
                                                Исход
                                            </th>
                                            <th className="w-[20%] py-2 px-2 text-right font-medium">
                                                Игра
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyRows.map((g) => {
console.log('g',g);
                                            return (
                                            <tr
                                                key={`${g.id}-${g.created_at}`}
                                                className="border-b border-border/60 last:border-0"
                                            >
                                                <td className="py-3 px-3">
                                                    {g.created_at ? (
                                                        <>
                                                            <span className="font-medium">
                                                                {formatGameDate(
                                                                    g.created_at,
                                                                )}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted-foreground font-medium">
                                                            Игра #{g.id}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-3">
                                                    {g.group ? (
                                                        <Link
                                                            href={route(
                                                                'group.detail',
                                                                {
                                                                    id: g.group
                                                                        .id,
                                                                },
                                                            )}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {g.group.name ??
                                                                `Группа #${g.group.id}`}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-right tabular-nums">
                                                    {g.my_points != null
                                                        ? g.my_points
                                                        : '—'}
                                                </td>
                                                <td
                                                    className={`px-2 py-3 text-center font-medium ${resultClass(g.won)}`}
                                                >
                                                    {resultLabel(g.won)}
                                                </td>
                                                <td className="px-2 py-3 text-right">
                                                    <Link
                                                        href={route(
                                                            'game.show',
                                                            g.id,
                                                        )}
                                                        className="text-primary text-sm hover:underline"
                                                    >
                                                        Подробнее
                                                    </Link>
                                                </td>
                                            </tr>
                                        )})}
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
