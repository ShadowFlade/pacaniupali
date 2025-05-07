'user client';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { router, useForm, usePage } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';

type IAddUserToGroupModal = {
    groupId: number;
};

export function AddUserToGroupModal({ groupId }: IAddUserToGroupModal) {
    const [open, setOpen] = useState(false);
    const { auth, props } = usePage();

    const [players, setPlayers] = useState([]);
    console.log(players,' players');
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

    if (open) {
        // const resp = fetch(route("user.playedWithUsers"), {
        //     method: "POST",
        //     body: JSON.stringify({ groupId }),
        // }).then(resp => console.log(resp.json()));
        console.log(usePage(),' page');
        fetch(route('user.playedWithUsers'), {
            method:'POST',
            headers: {
                'X-CSRF-TOKEN' : props.csrf,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({groupId})
        });
    }
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
                    {players.map((player) => (
                        <div
                            key={player.id}
                            className="flex items-center space-x-2"
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
                    ))}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
