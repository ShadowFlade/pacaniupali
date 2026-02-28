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
import { useForm, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Button } from '../../../components/ui/button';
('user client');

type IAddUserToGroupModal = {
    groupId: number;
};
let isFetched = false; //TODO:dirty hack - get rid of it

type IPlayer = {
    id: number;
    username: string;
};

const ITypeVariants = {
    from_group: 'from_group',
    played_with: 'played_with',
} as const;

export function AddUserToGroupModal({ groupId }: IAddUserToGroupModal) {
    const [open, setOpen] = useState(false);
    const dialogContentRef = useRef<HTMLDivElement>(null);
    const { props } = usePage<PageProps>();

    //i really dont like this state duplicating - what if we have 10 diff states? how to deal with that situation? this is most likely okay HERE, but just curious (its not a todo (i think))
    const [groupUsers, setGroupUsers] = useState([]);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const [playedWithUsers, setPlayedWithUsers] = useState([]);
    const [selectedPlayedWithUsers, setSelectedPlayedWithUsers] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);

    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const { post, setData, reset } = useForm({
        players: selectedPlayers,
        group_id: groupId,
        found_user_id: '0',
    });

    const addUserFormHandler = (e) => {
        e.preventDefault();
        post(route('user_group.store'), {
            onSuccess: (e) => {
                console.log(e);
            },
        });
        reset();
    };

    /**
     *
     * @param playerId
     * @param setFn Функция которая сетит состояние чекбоксов для плееров
     */
    const handlePlayerToggle = (playerId: string, setFn) => {
        setFn((current) => {
            const updated = current.includes(playerId)
                ? current.filter((id) => id !== playerId)
                : [...current, playerId];

            setData('players', updated);
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
    ) => {
        // list = [{ login: "dickinson.aubrey", id: 5 }]
        const entries = Object.entries(list);
        return entries && entries.length ? (
            <ul className="mt-8">
                {list.length && <h6>{label}</h6>}
                {entries.map(([_, player]) => {
                    return (
                        <div
                            key={player.id}
                            className="mt-2 flex items-center space-x-2"
                        >
                            <Checkbox
                                checked={selected.includes(
                                    player.id.toString(),
                                )}
                                onCheckedChange={() =>
                                    handlePlayerToggle(
                                        player.id.toString(),
                                        setFn,
                                    )
                                }
                                id={`player-${player.id}`}
                            />
                            <label
                                htmlFor={`player-${player.id}`}
                                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {player.username}
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
                    <span>Add User</span>
                </Button>
            </DialogTrigger>
            <DialogContent
                ref={dialogContentRef}
                className="flex h-[420px] max-w-[42rem] flex-col"
            >
                <DialogHeader>
                    <DialogTitle className={'mb-4'}>Добавить пользователя</DialogTitle>
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
                        disabled={selectedPlayers.length == 0}
                    >
                        <span>Добавить пользователей</span>
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
