'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './AddGameModal.css';
import * as z from 'zod';

// Mock data - replace with your actual data fetching
const mockGroups = [
    {
        id: 1,
        name: 'Team Alpha',
        players: [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Smith' },
            { id: 3, name: 'Bob Johnson' }
        ]
    },
    {
        id: 2,
        name: 'Casual Players',
        players: [
            { id: 4, name: 'Alice Brown' },
            { id: 5, name: 'Charlie Wilson' }
        ]
    }
];

const formSchema = z.object({
    game_start: z.date({
        required_error: 'Game start time is required'
    }),
    game_end: z.date({
        required_error: 'Game end time is required'
    }),
    group_id: z.string().min(1, 'Please select a group'),
    winner_id: z.string().min(1, 'Please select a winner'),
    players: z.array(z.string()).min(1, 'Please select at least one player')
});

const CustomDatePickerInput = ({ value, onClick, label }: { value?: string; onClick?: () => void; label: string }) => (
    <div className="relative">
        <Button type="button" variant="outline" className="w-full justify-start text-left font-normal"
                onClick={onClick}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value || `Select ${label}`}
        </Button>
    </div>
);

export function AddGameModal({ groups, players, currUserID, showSelectGroup, selectedGroupID }) {
    console.log({ showSelectGroup, selectedGroupID, players }, ' sdfslkjdflksjdf');
    const [open, setOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[0] | null>(groups.find(item => item.id == selectedGroupID));
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            game_start: undefined,
            game_end: undefined,
            group_id: '',
            winner_id: '',
            players: []
        }
    });


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        // Here you would typically send the data to your API
        setOpen(false);
        form.reset();
        setSelectedGroup(null);
        setSelectedPlayers([]);
    };

    const handleGroupChange = (groupId: string) => {
        const group = groups.find((g) => g.id.toString() === groupId);
        setSelectedGroup(group || null);
        setSelectedPlayers([]);
        form.setValue('winner_id', '');
        form.setValue('players', []);
    };

    const handlePlayerToggle = (playerId: string) => {
        setSelectedPlayers((current) => {
            const updated = current.includes(playerId)
                ? current.filter((id) => id !== playerId)
                : [...current, playerId];

            // If the winner is no longer in the selected players, reset the winner
            if (!updated.includes(form.getValues('winner_id'))) {
                form.setValue('winner_id', '');
            }

            form.setValue('players', updated);
            return updated;
        });
    };

    const renderWinnerField = () => {
        return (
            <FormField
                control={form.control}
                name="winner_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Winner</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={selectedPlayers.length === 0}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select winner" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {players
                                    .filter((player) => selectedPlayers.includes(player.id.toString()))
                                    .map((player, index, array) => {
                                            console.log(array, ' array');
                                            return (
                                                <SelectItem key={player.id}
                                                            value={player.id.toString()}>
                                                    {player.login}
                                                </SelectItem>
                                            );
                                        }
                                    )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    const renderGameStartField = () => {
        return (
            <FormField
                control={form.control}
                name="game_start"
                render={({ field }) => (
                    <FormItem className="space-y-2 flex flex-col">
                        <FormLabel>Game Start</FormLabel>
                        <FormControl>
                            <DatePicker
                                selected={field.value}
                                onChange={(date: Date) => field.onChange(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                customInput={
                                    <CustomDatePickerInput
                                        label="start time"
                                        value={field.value
                                            ? format(field.value, 'MMM d, yyyy h:mm aa')
                                            : undefined
                                        }
                                    />
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    const renderGameEndField = () => {
        return (
            <FormField
                control={form.control}
                name="game_end"
                render={({ field }) => (
                    <FormItem className="space-y-2 flex flex-col">
                        <FormLabel>Game End</FormLabel>
                        <FormControl>
                            <DatePicker
                                className="mt-0"
                                selected={field.value}
                                onChange={(date: Date) => field.onChange(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                customInput={
                                    <CustomDatePickerInput
                                        label="start time"
                                        value={field.value
                                            ? format(field.value, 'MMM d, yyyy h:mm aa')
                                            : undefined
                                        }
                                    />
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    const renderGroupField = () => {
        return (
            <FormField
                control={form.control}
                name="group_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Group</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                field.onChange(value);
                                handleGroupChange(value);
                            }}
                            value={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a group" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {groups.map((group) => (
                                    <SelectItem key={group.id} value={group.id.toString()}>
                                        {group.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    const renderSelectPlayersField = () => {
        return (
            <FormField
                control={form.control}
                name="players"
                render={() => (
                    <FormItem>
                        <FormLabel>Players</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                            {players.map((player) => (
                                <div key={player.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={selectedPlayers.includes(player.id.toString())}
                                        onCheckedChange={() => handlePlayerToggle(player.id.toString())}
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
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1 hover:bg-secondary-foreground hover:text-secondary transition-colors duration-200 active:scale-95"
                >
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Game</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[42rem] h-[420px]">
                <DialogHeader>
                    <DialogTitle>Добавить новую игру</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {renderGameStartField()}
                            {renderGameEndField()}
                        </div>

                        {
                            showSelectGroup && renderGroupField()
                        }


                        {selectedGroup && (
                            <>
                                {renderSelectPlayersField()}
                                {renderWinnerField()}
                            </>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Добавить игру</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

