import { SearchUsersSelect } from '@/Components/SearchUsersSelect';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Button } from '../../../components/ui/button';
('user client');

type IAddUserToGroupModal = {
    groupId: number;
    setUsergroupUsers: Dispatch<SetStateAction<any>>;
    userGroupUsers: IPlayer[];
};
export type IPlayer = {
    id: number;
    username: string;
};

function normalizeUserIds(ids: Array<string | number>): string[] {
    return [...new Set(ids.map((id) => String(id)))];
}

function toNumericId(s: string): number | null {
    const n = Number(s);
    return Number.isNaN(n) ? null : n;
}

function idEqualsLoose(a: string, b: string): boolean {
    if (a === b) return true;
    const na = toNumericId(a);
    const nb = toNumericId(b);
    return na !== null && nb !== null && na === nb;
}

function selectionIncludesId(selection: string[], pid: string): boolean {
    if (!pid) return false;
    return selection.some((s) => idEqualsLoose(s, pid));
}

function setHasIdLoose(set: Set<string>, id: string): boolean {
    if (!id) return false;
    if (set.has(id)) return true;
    const n = toNumericId(id);
    if (n === null) return false;
    for (const x of set) {
        if (toNumericId(x) === n) return true;
    }
    return false;
}

function removalHintHas(hints: string[], pid: string): boolean {
    if (!pid) return false;
    return hints.some((h) => idEqualsLoose(h, pid));
}

/** id, user_id, pivot.user_id (BelongsToMany) или вложенный user.id */
function resolvedUserId(u: unknown): string {
    if (u == null || typeof u !== 'object') return '';
    const o = u as Record<string, unknown>;
    const nested = o.user;
    const fromNested =
        nested && typeof nested === 'object'
            ? (nested as Record<string, unknown>).id
            : undefined;
    const pivot = o.pivot;
    const fromPivot =
        pivot && typeof pivot === 'object'
            ? (pivot as Record<string, unknown>).user_id
            : undefined;
    const v = o.id ?? o.user_id ?? fromNested ?? fromPivot;
    if (v === undefined || v === null) return '';
    return String(v);
}

function resolvedPlayerId(p: unknown): string {
    return resolvedUserId(p);
}

function groupMembersMatchPid(members: unknown[], pid: string): boolean {
    if (!pid) return false;
    return members.some((m) => idEqualsLoose(resolvedUserId(m), pid));
}

function idsShownWithCheckboxes(
    foundUsers: IPlayer[],
    playedWithUsers: IPlayer[],
): Set<string> {
    return new Set([
        ...foundUsers.map((p) => resolvedPlayerId(p)),
        ...playedWithUsers.map((p) => resolvedPlayerId(p)),
    ]);
}

function computeToDeleteUserIds(
    userGroupUsers: IPlayer[],
    selection: string[],
    foundUsers: IPlayer[],
    playedWithUsers: IPlayer[],
    excludeAuthUserId: number | undefined,
): number[] {
    const visibleIds = idsShownWithCheckboxes(foundUsers, playedWithUsers);
    const out: number[] = [];
    for (const m of userGroupUsers) {
        const mid = resolvedUserId(m);
        if (!mid) continue;
        if (!setHasIdLoose(visibleIds, mid)) continue;
        if (selectionIncludesId(selection, mid)) continue;
        if (
            excludeAuthUserId !== undefined &&
            Number(mid) === Number(excludeAuthUserId)
        ) {
            continue;
        }
        const n = Number(mid);
        if (!Number.isNaN(n)) out.push(n);
    }
    return out;
}

export function AddUserToGroupModal({
    groupId,
    setUsergroupUsers,
    userGroupUsers,
}: IAddUserToGroupModal) {
    const [open, setOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const { props } = usePage<PageProps>();
    const currentUserId = props.auth?.user?.id;

    type ModalPickState = { selectedIds: string[]; removalHints: string[] };
    const [pick, setPick] = useState<ModalPickState>({
        selectedIds: [],
        removalHints: [],
    });

    const mergeSelectedIds = useCallback((updater: SetStateAction<string[]>) => {
        setPick((prev) => ({
            ...prev,
            selectedIds: normalizeUserIds(
                typeof updater === 'function'
                    ? updater(prev.selectedIds)
                    : updater,
            ),
        }));
    }, []);

    const otherMembersForHints = useMemo(() => {
        if (currentUserId === undefined) return userGroupUsers;
        return userGroupUsers.filter(
            (u) => Number(resolvedUserId(u)) !== Number(currentUserId),
        );
    }, [userGroupUsers, currentUserId]);

    const [groupUsers, setGroupUsers] = useState([]);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const [playedWithUsers, setPlayedWithUsers] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [playedWithLoading, setPlayedWithLoading] = useState(false);
    const prevFoundUserIdsRef = useRef<Set<string>>(new Set());
    const userUncheckedIdsRef = useRef<Set<string>>(new Set());
    const userGroupUsersRef = useRef(userGroupUsers);
    userGroupUsersRef.current = userGroupUsers;

    useEffect(() => {
        const currentIds = new Set(
            foundUsers.map((p: IPlayer) => resolvedPlayerId(p)),
        );
        const newIds = [...currentIds].filter(
            (id) => !prevFoundUserIdsRef.current.has(id),
        );
        prevFoundUserIdsRef.current = currentIds;
        if (newIds.length === 0) return;

        const groupUserIds = new Set(
            userGroupUsers.map((u) => resolvedUserId(u)).filter(Boolean),
        );
        const toSelect = newIds.filter((id) => setHasIdLoose(groupUserIds, id));
        if (toSelect.length === 0) return;

        mergeSelectedIds((prev) => normalizeUserIds([...prev, ...toSelect]));
    }, [foundUsers, userGroupUsers, mergeSelectedIds]);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setPlayedWithLoading(true);
        fetch(route('user.playedWithUsers'), {
            method: 'POST',
            headers: {
                //@ts-ignore
                'X-CSRF-TOKEN': props.csrf,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupId }),
        })
            .then((resp) => resp.json())
            .then((players) => {
                if (cancelled) return;
                setGroupUsers(
                    players.group_users
                        ? Object.values(players.group_users)
                        : [],
                );
                const played: IPlayer[] = players.played_with
                    ? Object.values(players.played_with)
                    : [];
                setPlayedWithUsers(played);

                const inGroupIds = new Set(
                    userGroupUsersRef.current
                        .map((u) => resolvedUserId(u))
                        .filter(Boolean),
                );
                const preselectedFromPlayed = played
                    .filter((p) =>
                        setHasIdLoose(inGroupIds, resolvedPlayerId(p)),
                    )
                    .map((p) => resolvedPlayerId(p))
                    .filter((id) => !userUncheckedIdsRef.current.has(id));
                mergeSelectedIds((prev) =>
                    normalizeUserIds([...prev, ...preselectedFromPlayed]),
                );
            })
            .catch(() => {
                if (!cancelled) {
                    setGroupUsers([]);
                    setPlayedWithUsers([]);
                }
            })
            .finally(() => {
                if (!cancelled) setPlayedWithLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [open, groupId, props.csrf, mergeSelectedIds]);

    const addUserFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const inGroupIds = new Set(
            userGroupUsers.map((u) => resolvedUserId(u)).filter(Boolean),
        );
        const selection = normalizeUserIds(pick.selectedIds);
        const toAdd = selection.filter((id) => !setHasIdLoose(inGroupIds, id));
        const toDelete = computeToDeleteUserIds(
            userGroupUsers,
            selection,
            foundUsers,
            playedWithUsers,
            currentUserId,
        );

        if (toAdd.length === 0 && toDelete.length === 0) return;

        const csrf = (props as { csrf?: string }).csrf ?? '';
        const res = await fetch(route('user_group.manage'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrf,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                group_id: groupId,
                toAdd,
                toDelete,
            }),
        });
        const json = await res.json().catch(() => ({}));
        const data = json.data ?? json;
        const rawDeleted =
            data?.deleteResult ??
            data?.deleted_result ??
            data?.deletedResult ??
            data?.deleted;
        const deletedOk =
            Number(rawDeleted) === 1 ||
            rawDeleted === true ||
            (res.ok && toDelete.length > 0);

        if (res.ok && (json.success !== false)) {
            const added =
                data.addedMembers ?? data.added_members ?? data.newUsers ?? [];
            const addedMembers: IPlayer[] = (added || []).map(
                (item: { user_id: string | number }) => ({
                    id: Number(item.user_id),
                    username: '',
                }),
            );
            const deletedIds = deletedOk
                ? new Set(toDelete.map((id) => Number(id)))
                : new Set<number>();

            setUsergroupUsers((prev) => [
                ...prev.filter(
                    (u) => !deletedIds.has(Number(resolvedUserId(u))),
                ),
                ...addedMembers,
            ]);

            // Не сбрасывать весь выбор — иначе галочки пропадают и для оставшихся
            // участников группы показывается «Будет удалён».
            setPick((prev) => ({
                selectedIds: normalizeUserIds(
                    prev.selectedIds.filter(
                        (id) => !deletedIds.has(Number(id)),
                    ),
                ),
                removalHints: [],
            }));
            userUncheckedIdsRef.current.clear();
        }
    };

    const handleRowToggle = (playerId: string, wantChecked: boolean) => {
        const idStr = String(playerId);
        setPick((prev) => {
            const normalized = normalizeUserIds(prev.selectedIds);
            const wasSelected = selectionIncludesId(normalized, idStr);
            const inGroup = groupMembersMatchPid(
                userGroupUsersRef.current,
                idStr,
            );
            let removalHints = [...prev.removalHints];
            if (wantChecked) {
                userUncheckedIdsRef.current.delete(idStr);
                removalHints = removalHints.filter(
                    (x) => !idEqualsLoose(x, idStr),
                );
            } else {
                userUncheckedIdsRef.current.add(idStr);
                if (
                    wasSelected &&
                    inGroup &&
                    !removalHints.some((x) => idEqualsLoose(x, idStr))
                ) {
                    removalHints.push(idStr);
                }
            }
            const nextSelected = wantChecked
                ? normalizeUserIds([...normalized, idStr])
                : normalized.filter((id) => !idEqualsLoose(id, idStr));
            return { selectedIds: nextSelected, removalHints };
        });
    };

    const playersList = (
        list: IPlayer[],
        selected: string[],
        label: string,
        excludedFromList?: IPlayer[],
        rowIdPrefix: 'played' | 'found' = 'played',
    ) => {
        const entries = Object.entries(list);
        const selectedIds = normalizeUserIds(selected ?? []);
        return entries && entries.length ? (
            <ul className="mt-8">
                {list.length && <h6>{label}</h6>}

                {entries.map(([_, player]) => {
                    const pid = resolvedPlayerId(player);
                    const isSelected =
                        Boolean(pid) && selectionIncludesId(selectedIds, pid);

                    const isExcluded =
                        Boolean(excludedFromList) &&
                        groupMembersMatchPid(
                            excludedFromList as unknown[],
                            pid,
                        );

                    const isInGroup = groupMembersMatchPid(
                        userGroupUsers as unknown[],
                        pid,
                    );
                    const rowDomId = `${rowIdPrefix}-player-${pid || 'x'}`;
                    const willBeRemoved =
                        !isSelected &&
                        (isInGroup ||
                            isExcluded ||
                            removalHintHas(pick.removalHints, pid));
                    let titleText = '';
                    if (willBeRemoved) {
                        titleText = 'Удалить из группы?';
                    } else if (isSelected && !isInGroup) {
                        titleText = 'Добавить в группу?';
                    }

                    return (
                        <div
                            key={`${rowIdPrefix}-${pid || player.id}`}
                            className="mt-2 flex items-center space-x-2"
                        >
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                    if (checked === 'indeterminate') return;
                                    handleRowToggle(pid, checked === true);
                                }}
                                title={titleText}
                                id={rowDomId}
                            />
                            <label
                                htmlFor={rowDomId}
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {player.username}{' '}
                                {isExcluded && (
                                    <span>(Он уже состоит в группе)</span>
                                )}
                                {willBeRemoved && (
                                    <span className="text-destructive font-medium">
                                        {' '}
                                        — Будет удалён из группы
                                    </span>
                                )}
                            </label>
                        </div>
                    );
                })}
            </ul>
        ) : null;
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (next) {
                    setPlayedWithLoading(true);
                } else {
                    userUncheckedIdsRef.current.clear();
                    prevFoundUserIdsRef.current = new Set();
                    setGroupUsers([]);
                    setPlayedWithUsers([]);
                    setFoundUsers([]);
                    setPick({ selectedIds: [], removalHints: [] });
                    setPlayedWithLoading(false);
                }
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                    className="hover:bg-secondary-foreground hover:text-secondary flex items-center gap-1 transition-colors duration-200 active:scale-95"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span title={'Управлять участниками группы'}>Игроки</span>
                </Button>
            </DialogTrigger>
            <DialogContent
                ref={dialogContentRef}
                className="flex h-[420px] max-w-[42rem] flex-col"
            >
                <DialogHeader>
                    <DialogTitle className={'mb-4'}>
                        Добавить пользователя
                    </DialogTitle>
                    <SearchUsersSelect
                        container={dialogContentRef}
                        stateSetter={setFoundUsers}
                        className={'mt-10'}
                    />
                </DialogHeader>

                <form
                    onSubmit={addUserFormHandler}
                    className="flex h-full flex-col justify-between"
                >
                    <Tabs defaultValue="played_with" className="w-[400px]">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="played_with">
                                Играли вместе
                            </TabsTrigger>
                            <TabsTrigger value="from_group">
                                Из группы
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={'played_with'}>
                            {playedWithLoading ? (
                                <p className="text-muted-foreground mt-4 text-sm">
                                    Загрузка списка…
                                </p>
                            ) : null}
                            {!playedWithLoading &&
                            playedWithUsers.length === 0 &&
                            foundUsers.length === 0 ? (
                                <p className="text-muted-foreground mt-4 text-sm">
                                    В этом списке пока никого нет. Найдите
                                    игрока через поиск выше.
                                </p>
                            ) : null}
                            {playersList(
                                playedWithUsers,
                                pick.selectedIds,
                                '',
                                otherMembersForHints,
                                'played',
                            )}
                            {playersList(
                                foundUsers,
                                pick.selectedIds,
                                'Найденные игроки',
                                otherMembersForHints,
                                'found',
                            )}
                        </TabsContent>
                        <TabsContent value="from_group">
                            а нахуя ты сюда это написал ебаный дебил ты че
                            хочешь добавить в группу из группы конченный
                            идиот
                        </TabsContent>
                    </Tabs>
                    <Button
                        variant="secondary"
                        size="sm"
                        className="hover:bg-secondary-foreground hover:text-secondary mt-4 flex items-center gap-1 transition-colors duration-200 active:scale-95"
                        disabled={
                            (() => {
                                const inGroupIds = new Set(
                                    userGroupUsers
                                        .map((u) => resolvedUserId(u))
                                        .filter(Boolean),
                                );
                                const selection = normalizeUserIds(
                                    pick.selectedIds,
                                );
                                const toAdd = selection.filter(
                                    (id) => !setHasIdLoose(inGroupIds, id),
                                );
                                const toDelete = computeToDeleteUserIds(
                                    userGroupUsers,
                                    selection,
                                    foundUsers,
                                    playedWithUsers,
                                    currentUserId,
                                );
                                return (
                                    toAdd.length === 0 &&
                                    toDelete.length === 0
                                );
                            })()
                        }
                        type={'submit'}
                    >
                        <span>Сохранить</span>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
