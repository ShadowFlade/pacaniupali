'use client';

import { SearchUsersSelect } from '@/Components/SearchUsersSelect';
import type { GroupOutgoingInviteRow } from '@/types/groupInvites';
import type { UserSearchItem } from '@/utility/requests';
import { router } from '@inertiajs/react';
import { Copy, Link2, Loader2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type GroupMemberLite = { id: number };

type GroupInvitesSettingsTabProps = {
    groupId: number | string;
    authUserId?: number;
    members: GroupMemberLite[];
    outgoingInvites?: GroupOutgoingInviteRow[];
};

function inviteAcceptBaseUrl(): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/invites/accept`;
}

function fullInviteLink(key: string): string {
    const base = inviteAcceptBaseUrl();
    return base ? `${base}?key=${encodeURIComponent(key)}` : key;
}

function CopyInviteLinkButton({ inviteKey }: { inviteKey: string }) {
    const [done, setDone] = useState(false);
    const link = fullInviteLink(inviteKey);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(link);
            setDone(true);
            window.setTimeout(() => setDone(false), 2000);
        } catch {
            setDone(false);
        }
    };

    return (
        <Button type="button" variant="outline" size="sm" onClick={copy}>
            <Link2 className="mr-1.5 h-3.5 w-3.5" />
            {done ? 'Ссылка скопирована' : 'Копировать ссылку'}
        </Button>
    );
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
        <Button type="button" variant="ghost" size="sm" onClick={copy}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            {done ? 'Код скопирован' : 'Код'}
        </Button>
    );
}

function formatOptionalDate(iso: string | null | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('ru-RU');
}

export function GroupInvitesSettingsTab({
    groupId,
    authUserId,
    members,
    outgoingInvites = [],
}: GroupInvitesSettingsTabProps) {
    const [selected, setSelected] = useState<UserSearchItem[]>([]);
    const [expiresAt, setExpiresAt] = useState('');
    const [maxUses, setMaxUses] = useState('1');
    const [submitting, setSubmitting] = useState(false);

    const isMember = useMemo(() => {
        if (authUserId == null) return false;
        return members.some((m) => Number(m.id) === Number(authUserId));
    }, [authUserId, members]);

    const inviteeId = selected[0]?.id;

    const replaceSelection = useCallback((next: UserSearchItem[]) => {
        setSelected(next.length ? [next[next.length - 1]] : []);
    }, []);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (inviteeId == null) return;

        setSubmitting(true);
        router.post(
            '/invites',
            {
                group_id: groupId,
                user_id: inviteeId,
                expires_at: expiresAt || null,
                max_uses: maxUses === '' ? 1 : Number(maxUses),
            },
            {
                preserveScroll: true,
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <div className="space-y-6">
            {!isMember ? (
                <p className="text-sm text-muted-foreground">
                    Создавать приглашения могут только участники группы.
                </p>
            ) : (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">
                            Новое приглашение по ссылке
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Укажите пользователя, срок действия и лимит
                            переходов. После сохранения на сервере ему уйдёт
                            уведомление; принять можно со страницы «Приглашения»
                            или по ссылке.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-4"
                            onSubmit={handleCreate}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="invite-user-search">
                                    Кого пригласить
                                </Label>
                                <SearchUsersSelect
                                    className="w-full max-w-md"
                                    placeholder="Поиск по имени…"
                                    stateSetter={replaceSelection}
                                />
                                {selected[0] ? (
                                    <p className="text-xs text-muted-foreground">
                                        Выбран:{' '}
                                        <span className="font-medium text-foreground">
                                            {selected[0].username ??
                                                `#${selected[0].id}`}
                                        </span>
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="invite-expires">
                                        Действует до
                                    </Label>
                                    <Input
                                        id="invite-expires"
                                        type="datetime-local"
                                        value={expiresAt}
                                        onChange={(ev) =>
                                            setExpiresAt(ev.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="invite-max-uses">
                                        Макс. использований ссылки
                                    </Label>
                                    <Input
                                        id="invite-max-uses"
                                        type="number"
                                        min={1}
                                        value={maxUses}
                                        onChange={(ev) =>
                                            setMaxUses(ev.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={
                                    submitting || inviteeId == null
                                }
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Создаём…
                                    </>
                                ) : (
                                    'Создать приглашение'
                                )}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Ожидается{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    POST /invites
                                </code>{' '}
                                с полями{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    group_id
                                </code>
                                ,{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    user_id
                                </code>
                                ,{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    expires_at
                                </code>
                                ,{' '}
                                <code className="rounded bg-muted px-1 py-0.5">
                                    max_uses
                                </code>
                                ; ключ ссылки генерирует сервер.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">
                        Активные приглашения этой группы
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Список заполняется, когда бэкенд передаёт в страницу
                        группы массив{' '}
                        <code className="rounded bg-muted px-1 py-0.5">
                            outgoingInvites
                        </code>
                        .
                    </p>
                </CardHeader>
                <CardContent>
                    {outgoingInvites.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            Пока нет записей или данные ещё не подключены.
                        </p>
                    ) : (
                        <ul className="space-y-4">
                            {outgoingInvites.map((row) => (
                                <li
                                    key={row.id}
                                    className="rounded-lg border border-border bg-card p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <p className="font-medium">
                                                {row.invitee?.username ??
                                                    row.invitee?.login ??
                                                    `Пользователь #${row.user_id}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Пригласил:{' '}
                                                {row.inviter?.username ??
                                                    row.inviter?.login ??
                                                    (row.invited_by_user_id
                                                        ? `#${row.invited_by_user_id}`
                                                        : '—')}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <CopyInviteLinkButton
                                                inviteKey={row.key}
                                            />
                                            <CopyKeyButton
                                                inviteKey={row.key}
                                            />
                                        </div>
                                    </div>
                                    <dl className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                                        <div>
                                            <dt className="inline font-medium">
                                                До:{' '}
                                            </dt>
                                            <dd className="inline">
                                                {formatOptionalDate(
                                                    row.expires_at,
                                                )}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="inline font-medium">
                                                Использований:{' '}
                                            </dt>
                                            <dd className="inline">
                                                {row.uses_count ?? 0}
                                                {row.max_uses != null
                                                    ? ` / ${row.max_uses}`
                                                    : ''}
                                            </dd>
                                        </div>
                                    </dl>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
