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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui/button';
('user client');

type IAddUserToGroupModal = {
    groupId: number;
    setUsergroupUsers: Dispatch<SetStateAction<any>>;
    userGroupUsers: IPlayer[];
};
let isFetched = false; //TODO:dirty hack - get rid of it

export type IPlayer = {
    id: number;
    username: string;
};

const ITypeVariants = {
    from_group: 'from_group',
    played_with: 'played_with',
} as const;

export function AddUserToGroupModal({
    groupId,
    setUsergroupUsers,
    userGroupUsers,
}: IAddUserToGroupModal) {
    const [open, setOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const { props } = usePage<PageProps>();

    //i really dont like this state duplicating - what if we have 10 diff states? how to deal with that situation? this is most likely okay HERE, but just curious (its not a todo (i think))
    const [groupUsers, setGroupUsers] = useState([]);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const [playedWithUsers, setPlayedWithUsers] = useState([]);
    const [selectedPlayedWithUsers, setSelectedPlayedWithUsers] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const prevFoundUsersLengthRef = useRef(0);

    // When users are added from SearchUsersSelect (foundUsers), pre-check those who are in userGroupUsers. Only run when foundUsers grows so unchecking is not overwritten.
    useEffect(() => {
        if (foundUsers.length <= prevFoundUsersLengthRef.current) {
            prevFoundUsersLengthRef.current = foundUsers.length;
            return;
        }
        prevFoundUsersLengthRef.current = foundUsers.length;
        const groupUserIds = new Set(userGroupUsers.map((u) => u.id.toString()));
        const toSelect = foundUsers
            .filter((p) => groupUserIds.has(p.id.toString()))
            .map((p) => p.id.toString());
        if (toSelect.length === 0) return;

        setSelectedPlayedWithUsers((prev) => [...new Set([...prev, ...toSelect])]);
        setSelectedPlayers((prev) => [...new Set([...prev, ...toSelect])]);
    }, [foundUsers, userGroupUsers]);

    const addUserFormHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const inGroupIds = new Set(userGroupUsers.map((u) => u.id.toString()));
        const toAdd = selectedPlayers.filter((id) => !inGroupIds.has(id));
        // В toDelete только те, кто в группе, показан в модалке (есть чекбокс) и с кого сняли галочку
        const visibleInModalIds = new Set([
            ...foundUsers.map((p: IPlayer) => p.id.toString()),
            ...groupUsers.map((p: IPlayer) => p.id.toString()),
            ...playedWithUsers.map((p: IPlayer) => p.id.toString()),
        ]);
        const toDelete = userGroupUsers
            .filter(
                (u) =>
                    visibleInModalIds.has(u.id.toString()) &&
                    !selectedPlayers.includes(u.id.toString()),
            )
            .map((u) => u.id);

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
            setSelectedPlayers([]);
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
                ...prev.filter((u) => !deletedIds.has(Number(u.id))),
                ...addedMembers,
            ]);
        }
    };

    /**
     *
     * @param playerId
     * @param setFn Функция которая сетит состояние чекбоксов для плееров
     */
    const handlePlayerToggle = (
        playerId: string,
        setFn: Dispatch<SetStateAction<string[]>>,
    ) => {
        setFn((current) => {
            const updated = current.includes(playerId)
                ? current.filter((id) => id !== playerId)
                : [...current, playerId];
            console.log(updated,'updated',current,'current')
            setSelectedPlayers(updated);
            return updated;
        });
    };

    if (open && !isFetched) {
        //how can we use caching here with some idiomatic inertia shit?
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
                isFetched = true;
                setGroupUsers(
                    players.group_users
                        ? Object.values(players.group_users)
                        : [],
                );
                setPlayedWithUsers(
                    players.played_with
                        ? Object.values(players.played_with)
                        : [],
                );
            });
    }

    function handleTabsChange(value) {
        switch (value) {
            case ITypeVariants.from_group:
                setSelectedPlayers(groupUsers);
                break;
            case ITypeVariants.played_with:
                setSelectedPlayers(playedWithUsers);
                break;
            default:
                setSelectedPlayers([]);
        }
    }

    const playersList = (
        list: IPlayer[],
        selected: string | any[],
        setFn: Dispatch<SetStateAction<any[]>>,
        label: string,
        excludedFromList?: IPlayer[],
    ) => {
        console.log(excludedFromList, ' excluded from list');
        // list = [{ login: "dickinson.aubrey", id: 5 }]
        const entries = Object.entries(list);
        console.log(selected, ' selected', excludedFromList, ' exluded');
        return entries && entries.length ? (
            <ul className="mt-8">
                {list.length && <h6>{label}</h6>}

                {entries.map(([_, player]) => {
                    let isJustSelected = true;
                    const isSelected = selected.includes(player.id.toString());
                    console.log(isSelected,selected,'selected');

                    const isExcluded =
                        excludedFromList &&
                        !!excludedFromList.find(
                            (item) =>
                                item.id.toString() == player.id.toString(),
                        );

                    const isInGroup = !!userGroupUsers.find(
                        (item) => item.id == player.id,
                    );
                    const willBeRemoved = isInGroup && !isSelected;
                    let titleText = '';
                    if (willBeRemoved) {
                        titleText = 'Удалить из группы?';
                    } else if (isSelected && !isInGroup) {
                        titleText = 'Добавить в группу?';
                    }

                    return (
                        <div
                            key={player.id}
                            className="mt-2 flex items-center space-x-2"
                        >
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={() =>
                                    handlePlayerToggle(
                                        player.id.toString(),
                                        setFn,
                                    )
                                }
                                title={titleText}
                                id={`player-${player.id}`}
                            />
                            <label
                                htmlFor={`player-${player.id}`}
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
        <Dialog open={open} onOpenChange={setOpen}>
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
                        userGroupUsers={userGroupUsers}
                    />
                </DialogHeader>

                <form
                    onSubmit={addUserFormHandler}
                    className="flex h-full flex-col justify-between"
                >
                    {Object.entries(foundUsers).length ||
                    Object.entries(groupUsers).length ||
                    Object.entries(playedWithUsers).length ? (
                        <Tabs
                            defaultValue="played_with"
                            className="w-[400px]"
                            onValueChange={handleTabsChange}
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="played_with">
                                    Играли вместе
                                </TabsTrigger>
                                <TabsTrigger value="from_group">
                                    Из группы
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value={'played_with'}>
                                {playersList(
                                    playedWithUsers,
                                    selectedPlayedWithUsers,
                                    setSelectedPlayedWithUsers,
                                    '',
                                )}
                                {playersList(
                                    foundUsers,
                                    selectedPlayedWithUsers,
                                    setSelectedPlayedWithUsers,
                                    'Найденные игроки',
                                    userGroupUsers,
                                )}
                            </TabsContent>
                            <TabsContent value="from_group">
                                а нахуя ты сюда это написал ебаный дебил ты че
                                хочешь добавить в группу из группы конченный
                                идиот
                            </TabsContent>
                        </Tabs>
                    ) : (
                        'Пользователей не найдено'
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        className="hover:bg-secondary-foreground hover:text-secondary mt-4 flex items-center gap-1 transition-colors duration-200 active:scale-95"
                        disabled={
                            (() => {
                                const inGroupIds = new Set(
                                    userGroupUsers.map((u) => u.id.toString()),
                                );
                                const toAdd = selectedPlayers.filter(
                                    (id) => !inGroupIds.has(id),
                                );
                                const visibleInModalIds = new Set([
                                    ...foundUsers.map((p: IPlayer) =>
                                        p.id.toString(),
                                    ),
                                    ...groupUsers.map((p: IPlayer) =>
                                        p.id.toString(),
                                    ),
                                    ...playedWithUsers.map((p: IPlayer) =>
                                        p.id.toString(),
                                    ),
                                ]);
                                const toDelete = userGroupUsers.filter(
                                    (u) =>
                                        visibleInModalIds.has(u.id.toString()) &&
                                        !selectedPlayers.includes(
                                            u.id.toString(),
                                        ),
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
