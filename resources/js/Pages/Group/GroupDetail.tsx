'use client';

import { AddGameModal } from '@/Components/Modals/AddGameModal/AddGameModal';
import { GamesHistory } from '@/Components/Games/GamesHistory';
import { GroupMembersList } from '@/Components/Group/GroupMembersList';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import General from '@/Layouts/General';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Gamepad2, Users } from 'lucide-react';

type GroupUser = {
    id: number;
    username?: string;
    login?: string;
    picture?: string;
    created_at?: string | null;
    joined_at?: string | null;
    wins_count?: number | null;
};

type Group = {
    id: number | string;
    name: string;
    description?: string | null;
    logo_path?: string | null;
    users?: GroupUser[];
};

type Game = {
    id: number | string;
    game_start: string;
    group_id?: number | string;
    player?: Array<{
        id: number;
        user_id: number;
        user: { id: number; username?: string; login?: string; picture?: string };
    }>;
    winner?: { player_id: number };
};

type GroupDetailProps = {
    auth: { user?: { id: number; username?: string } };
    group: Group;
    games?: Game[];
};

export default function GroupDetail({ auth, group, games = [] }: GroupDetailProps) {
    console.log(group,' group');
    const members = group.users ?? [];
    const gamesWithGroupId = games.map((g) => ({
        ...g,
        group_id: g.group_id ?? group.id,
    }));

    return (
        <General>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Link
                    href={route('group.index')}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    К списку групп
                </Link>

                {/* Шапка группы: лого, название, описание */}
                <Card className="mb-8 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                            <img
                                src={group.logo_path || '/placeholder.svg'}
                                alt={`${group.name} logo`}
                                className="h-24 w-24 shrink-0 rounded-xl object-cover shadow-sm"
                            />
                            <div className="min-w-0 flex-1">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {group.name}
                                </h1>
                                {group.description ? (
                                    <p className="mt-2 text-muted-foreground">
                                        {group.description}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Статистика и участники */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">
                                    {members.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Участников
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Gamepad2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-semibold">
                                    {games.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Игр сыграно
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Участники группы */}
                {members.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader className="pb-2">
                            <h2 className="text-lg font-semibold">
                                Участники группы
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <GroupMembersList members={members} />
                        </CardContent>
                    </Card>
                )}

                {/* История игр */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h2 className="text-lg font-semibold">
                            История игр
                        </h2>
                        <AddGameModal
                            groups={[group]}
                            players={members}
                            showSelectGroup={false}
                            selectedGroupID={group.id}
                        />
                    </CardHeader>
                    <CardContent>
                        {gamesWithGroupId.length > 0 ? (
                            <GamesHistory
                                games={gamesWithGroupId}
                                groups={[group]}
                            />
                        ) : (
                            <p className="py-8 text-center text-muted-foreground">
                                Пока нет ни одной игры. Добавьте первую!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </General>
    );
}
