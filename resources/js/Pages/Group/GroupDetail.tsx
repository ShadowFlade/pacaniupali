'use client';

import { AddGameModal } from '@/Components/Modals/AddGameModal/AddGameModal';
import { GamesHistory } from '@/Components/Games/GamesHistory';
import { GroupMembersList } from '@/Components/Group/GroupMembersList';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import General from '@/Layouts/General';
import { Link, router } from '@inertiajs/react';
import { useState, ChangeEvent, useEffect } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Gamepad2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import './GroupDetail.css';

type GroupUser = {
    id: number;
    username?: string;
    login?: string;
    picture?: string;
    created_at?: string | null;
    joined_at?: string | null;
    joined_group_at?: string | null;
    wins_count?: number | null;
    games?: unknown;
    wins?: unknown;
};

type Group = {
    id: number | string;
    name: string;
    description?: string | null;
    logo_path?: string | null;
    /** UserGroupPublicity: PUBLIC = 1, PRIVATE = 2 */
    publicity?: number;
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
    const [membersOpen, setMembersOpen] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [logoShake, setLogoShake] = useState(false);
    const [removedMemberIds, setRemovedMemberIds] = useState<number[]>([]);
    const [removedGameIds, setRemovedGameIds] = useState<Array<number | string>>(
        [],
    );
    const [logoPreview, setLogoPreview] = useState<string | null>(
        group.logo_path || null,
    );
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [publicity, setPublicity] = useState<1 | 2>(
        group.publicity === 2 ? 2 : 1,
    );

    useEffect(() => {
        setPublicity(group.publicity === 2 ? 2 : 1);
    }, [group.id, group.publicity]);

    const originalMembers = group.users ?? [];
    const members = originalMembers.filter(
        (m) => !removedMemberIds.includes(m.id),
    );

    const gamesWithGroupId = games.map((g) => ({
        ...g,
        group_id: g.group_id ?? group.id,
        players_count: g.player.length
    }));
    console.log(gamesWithGroupId,' game with group id');

    const visibleGames = gamesWithGroupId.filter(
        (g) => !removedGameIds.includes(g.id),
    );

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setLogoPreview(url);
        setLogoFile(file);
    };

    useEffect(() => {
        if (editMode) {
            setLogoShake(true);
            const timer = setTimeout(() => setLogoShake(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [editMode]);

    const handleToggleEdit = () => {
        // turning off edit mode -> send state to backend
        if (editMode) {
            const formData = new FormData();
            formData.append('_method', 'PATCH');
            formData.append('group_id', String(group.id));
            formData.append('publicity', String(publicity));

            const appendIds = (
                key: string,
                ids: Array<number | string>,
            ) => {
                for (const id of ids) {
                    formData.append(`${key}[]`, String(id));
                }
            };

            appendIds(
                'active_member_ids',
                members.map((m) => m.id),
            );
            appendIds('removed_member_ids', removedMemberIds);
            appendIds(
                'active_game_ids',
                visibleGames.map((g) => g.id),
            );
            appendIds('removed_game_ids', removedGameIds);

            if (logoFile) {
                formData.append('logo', logoFile);
            }

            router.post(route('group.update'), formData, {
                preserveScroll: true,
            });
        }

        setEditMode((prev) => !prev);
    };

    return (
        <General>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={route('group.index')}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        К списку групп
                    </Link>
                    <Button
                        type="button"
                        variant={editMode ? 'outline' : 'secondary'}
                        size="sm"
                        className="cursor-pointer"
                        onClick={handleToggleEdit}
                    >
                        {editMode ? 'Готово' : 'Редактировать'}
                    </Button>
                </div>

                {/* Шапка группы: лого, название, описание */}
                <Card className="mb-8 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                            <img
                                src={
                                    logoPreview ||
                                    group.logo_path ||
                                    '/placeholder.svg'
                                }
                                alt={`${group.name} logo`}
                                className="h-24 w-24 shrink-0 rounded-xl object-cover shadow-sm"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                    <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight">
                                        {group.name}
                                    </h1>
                                    <div className="flex shrink-0 items-start pt-0.5">
                                        {editMode ? (
                                            <div className="flex items-center gap-1.5">
                                                <Select
                                                    value={String(publicity)}
                                                    onValueChange={(v) =>
                                                        setPublicity(
                                                            Number(v) as 1 | 2,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        id="group-detail-publicity"
                                                        className="h-8 w-[148px] text-xs"
                                                    >
                                                        <SelectValue placeholder="Тип" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="1">
                                                            Публичная
                                                        </SelectItem>
                                                        <SelectItem value="2">
                                                            Приватная
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <TooltipProvider
                                                    delayDuration={200}
                                                >
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className="text-muted-foreground hover:text-foreground inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-current transition-colors"
                                                                aria-label="Справка о публичности группы"
                                                            >
                                                                <span className="text-[10px] font-semibold leading-none">
                                                                    i
                                                                </span>
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent
                                                            side="bottom"
                                                            className="max-w-xs text-pretty"
                                                        >
                                                            Публичные группы будут
                                                            видны в списке групп
                                                            всем пользователям, и
                                                            все пользователи могут
                                                            оставлять заявки на
                                                            присоединение.
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        ) : (
                                            <span
                                                className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                                title={
                                                    publicity === 2
                                                        ? 'Приватная группа'
                                                        : 'Публичная группа'
                                                }
                                            >
                                                {publicity === 2
                                                    ? 'Приватная'
                                                    : 'Публичная'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {group.description ? (
                                    <p className="mt-2 text-muted-foreground">
                                        {group.description}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        {editMode && (
                            <div className="mt-4">
                                <label
                                    className={`inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary ${
                                        logoShake ? 'shake-soft' : ''
                                    }`}
                                >
                                    <span>Изменить лого</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                            </div>
                        )}
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
                                    {visibleGames.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Игр сыграно
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Участники группы (dropdown) */}
                {members.length > 0 && (
                    <Card className="mb-8">
                        <CardHeader className="pb-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex w-full cursor-pointer items-center justify-between p-0 text-left font-semibold hover:bg-transparent"
                                onClick={() => setMembersOpen((o) => !o)}
                            >
                                <span className="text-lg">
                                    Участники группы ({members.length})
                                </span>
                                {membersOpen ? (
                                    <ChevronUp className="h-5 w-5 shrink-0" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 shrink-0" />
                                )}
                            </Button>
                        </CardHeader>
                        {membersOpen && (
                            <CardContent>
                                <GroupMembersList
                                    members={members}
                                    editable={editMode}
                                    onRemoveMember={(id) =>
                                        setRemovedMemberIds((prev) =>
                                            prev.includes(id)
                                                ? prev
                                                : [...prev, id],
                                        )
                                    }
                                />
                            </CardContent>
                        )}
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
                        {visibleGames.length > 0 ? (
                            <GamesHistory
                                games={visibleGames}
                                groups={[group]}
                                editable={editMode}
                                onDeleteGame={(id) =>
                                    setRemovedGameIds((prev) =>
                                        prev.includes(id)
                                            ? prev
                                            : [...prev, id],
                                    )
                                }
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
