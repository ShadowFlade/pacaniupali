'use client';

import General from '@/Layouts/General';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Mail, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/** Соответствует `App\Modules\Invite\Models\Invite` (+ опционально `group` с бэкенда). */
export type GroupInviteRow = {
    id: number;
    user_id: number;
    group_id: number;
    key: string;
    created_at?: string;
    updated_at?: string;
    group?: {
        id: number;
        name: string;
        code?: string;
    };
};

/** Заготовка под будущие приглашения в друзья. */
export type FriendInviteRow = {
    id: number;
    from_user_id?: number;
    from_user?: { id: number; username: string; login?: string };
    key?: string;
    message?: string;
    created_at?: string;
};

type InvitesPageProps = PageProps & {
    groupInvites?: GroupInviteRow[];
    friendInvites?: FriendInviteRow[];
    invites?: GroupInviteRow[];
    /** Опечатка в старых пропсах контроллера */
    $invites?: GroupInviteRow[];
};

function pickGroupInvites(props: InvitesPageProps): GroupInviteRow[] {
    if (props.groupInvites?.length !== undefined) {
        return props.groupInvites;
    }
    if (props.invites?.length !== undefined) {
        return props.invites;
    }
    const legacy = props.$invites;
    if (Array.isArray(legacy)) {
        return legacy;
    }
    return [];
}

function pickFriendInvites(props: InvitesPageProps): FriendInviteRow[] {
    return props.friendInvites ?? [];
}

function CopyKeyButton({ inviteKey }: { inviteKey: string }) {
    const [done, setDone] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(inviteKey);
            setDone(true);
            window.setTimeout(() => setDone(false), 2000);
        } catch {
            setDone(false);
        }
    };

    return (
        <Button type="button" variant="outline" size="sm" onClick={copy}>
            {done ? 'Скопировано' : 'Копировать код'}
        </Button>
    );
}

export default function InvitesList() {
    const page = usePage<InvitesPageProps>();
    const groupInvites = useMemo(
        () => pickGroupInvites(page.props),
        [page.props],
    );
    const friendInvites = useMemo(
        () => pickFriendInvites(page.props),
        [page.props],
    );

    return (
        <General>
            <Head title="Приглашения" />
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Приглашения
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Приглашения в группы и от других пользователей.
                    </p>
                </div>

                <Tabs defaultValue="groups" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="groups" className="gap-2">
                            <Mail className="h-4 w-4 shrink-0" />
                            В группы
                        </TabsTrigger>
                        <TabsTrigger value="friends" className="gap-2">
                            <UserPlus className="h-4 w-4 shrink-0" />
                            В друзья
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="groups" className="mt-6 space-y-4">
                        {groupInvites.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                    Нет активных приглашений в группы.
                                </CardContent>
                            </Card>
                        ) : (
                            groupInvites.map((invite) => (
                                <Card key={invite.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-medium">
                                            {invite.group?.name
                                                ? `Группа «${invite.group.name}»`
                                                : `Группа #${invite.group_id}`}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Код приглашения
                                            </p>
                                            <p className="mt-1 font-mono text-sm break-all">
                                                {invite.key}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <CopyKeyButton inviteKey={invite.key} />
                                            <Button variant="secondary" size="sm" asChild>
                                                <Link
                                                    href={route(
                                                        'group.detail',
                                                        invite.group_id,
                                                    )}
                                                >
                                                    Страница группы
                                                </Link>
                                            </Button>
                                        </div>
                                        {invite.created_at ? (
                                            <p className="text-xs text-muted-foreground">
                                                Создано:{' '}
                                                {new Date(
                                                    invite.created_at,
                                                ).toLocaleString('ru-RU')}
                                            </p>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="friends" className="mt-6 space-y-4">
                        {friendInvites.length === 0 ? (
                            <Card>
                                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                    Пока нет приглашений в друзья. Когда бэкенд
                                    начнёт отдавать список, он появится здесь.
                                </CardContent>
                            </Card>
                        ) : (
                            friendInvites.map((invite) => (
                                <Card key={invite.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base font-medium">
                                            {invite.from_user?.username ??
                                                invite.from_user?.login ??
                                                (invite.from_user_id
                                                    ? `Пользователь #${invite.from_user_id}`
                                                    : 'Приглашение')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        {invite.message ? (
                                            <p>{invite.message}</p>
                                        ) : null}
                                        {invite.key ? (
                                            <p className="font-mono text-xs break-all">
                                                {invite.key}
                                            </p>
                                        ) : null}
                                        {invite.created_at ? (
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    invite.created_at,
                                                ).toLocaleString('ru-RU')}
                                            </p>
                                        ) : null}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </General>
    );
}
