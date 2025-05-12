'user client';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';

type IAddUserToGroupModal = {
    groupId: number;
};
let isFetched = false; //TODO:dirty hack - get rid of it

export function AddUserToGroupModal({ groupId }: IAddUserToGroupModal) {
    const [open, setOpen] = useState(false);
    const { auth, props } = usePage();

    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const { post, data, setData, reset } = useForm({
        players: selectedPlayers,
    });
    const handlePlayerToggle = (playerId: string) => {
        setSelectedPlayers((current) => {
            const updated = current.includes(playerId)
                ? current.filter((id) => id !== playerId)
                : [...current, playerId];

            setData('players', updated);
            return updated;
        });
    };

    if (open && !isFetched) {
        //how can we use caching here with some idiomatic inertia shit?
        fetch(route('user.playedWithUsers'), {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': props.csrf,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupId }),
        })
            .then((resp) => resp.json())
            .then((players) => {
                isFetched = true;
                setPlayers(players);
            });
    }

    const playersList = (list) => {
        if(!list) return [];
        const entries = Object.entries(list);
        return entries && entries.length ? (
            <ul className="mt-8">
                {Object.entries(list).map(([id, player]) => {
                    return (
                        <div
                            key={player.id}
                            className="mt-2 flex items-center space-x-2"
                        >
                            <Checkbox
                                checked={selectedPlayers.includes(
                                    player.id.toString(),
                                )}
                                onCheckedChange={() =>
                                    handlePlayerToggle(player.id.toString())
                                }
                                id={`player-${player.id}`}
                            />
                            <label
                                htmlFor={`player-${player.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {player.login}
                            </label>
                        </div>
                    )
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
                    className="flex items-center gap-1 transition-colors duration-200 hover:bg-secondary-foreground hover:text-secondary active:scale-95"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add User</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[420px] max-w-[42rem]">
                <DialogHeader>
                    <DialogTitle>Добавить пользователя</DialogTitle>
                    {Object.entries(players).length && (
                        <Tabs defaultValue="played_with" className="w-[400px]">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="played_with">
                                    Играли вместе
                                </TabsTrigger>
                                <TabsTrigger value="from_group">
                                    Из группы
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="played_with">
                                {playersList(players.played_with)}
                            </TabsContent>
                            <TabsContent value="from_group">
                                {playersList(players.group_users)}
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
