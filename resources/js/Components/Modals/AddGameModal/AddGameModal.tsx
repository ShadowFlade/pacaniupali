'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './AddGameModal.css';
import { router } from '@inertiajs/react';
import * as z from 'zod';
import { DATE_FORMAT } from '@/utility/const';

type FormValues = {
    game_end: Date
    game_start: Date
    winner_id: number
    players: number[]
}

const CustomDatePickerInput = ({ value, onClick, label }: { value?: string; onClick?: () => void; label: string }) => (
    <div className="relative">
        <Button type="button" variant="outline" className="w-full justify-start text-left font-normal"
                onClick={onClick}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value || `Select ${label}`}
        </Button>
    </div>
);

export function AddGameModal({ groups, players, showSelectGroup, selectedGroupID }) {
    const [open, setOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<(typeof groups)[0] | null>(groups.find(item => item.id == selectedGroupID));
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);


    const { data, setData, post, transform, processing, errors, reset } = useForm({
        game_start: null,
        game_end: null,
        winner_id: '',
        players: selectedPlayers,
        group_id: selectedGroup.id
    });


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('game.store'), {
            onSuccess: (data) => console.log(data,' success'),
            onFinish: (smth) => console.log(smth)
        });

        setOpen(false);
        reset();
        setSelectedPlayers([]);
    };

    const handleGroupChange = (groupId: string) => {
        const group = groups.find((g) => g.id.toString() === groupId);
        setSelectedGroup(group || null);
        setSelectedPlayers([]);
        setData('winner_id', '');
        setData('players', []);
    };

    const handlePlayerToggle = (playerId: string) => {
        setSelectedPlayers((current) => {
            const updated = current.includes(playerId)
                ? current.filter((id) => id !== playerId)
                : [...current, playerId];

            // If the winner is no longer in the selected players, reset the winner
            if (!updated.includes(data.winner_id)) {
                setData('winner_id', '');
            }

            setData('players', updated);
            return updated;
        });
    };

    const renderWinnerField = () => {
        return (
            <div>
                <label htmlFor={'winner_id'}>Winner</label>
                <Select
                    onValueChange={e => setData('winner_id', e)}
                    value={data.winner_id}
                    disabled={selectedPlayers.length === 0}
                    name="winner_id"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите победителя" />
                    </SelectTrigger>
                    <SelectContent>
                        {players
                            .filter((player) => selectedPlayers.includes(player.id.toString()))
                            .map((player, index, array) => {
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
            </div>

        );
    };

    const renderGameStartField = () => {

        return (
            <div className="space-y-2 flex flex-col">
                <label>Game Start</label>
                <DatePicker
                    selected={data.game_start}
                    onChange={date => setData('game_start', date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={DATE_FORMAT}
                    customInput={
                        <CustomDatePickerInput
                            label="start time"
                            value={data.game_start
                                ? format(data.game_start, DATE_FORMAT)
                                : undefined
                            }
                        />
                    }
                    selectsMultiple={undefined}
                />
            </div>

        );
    };

    const renderGameEndField = () => {

        return (
            <div className="space-y-2 flex flex-col">
                <label>Game Start</label>
                <DatePicker
                    className="mt-0"
                    selected={data.game_end}
                    onChange={date => {
                        setData('game_end', date);
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={DATE_FORMAT}
                    customInput={
                        <CustomDatePickerInput
                            label="start time"
                            value={data.game_end
                                ? format(data.game_end, DATE_FORMAT)
                                : undefined
                            }
                        />
                    }
                    selectsMultiple={undefined}
                />
            </div>

        );
    };

    const renderGroupField = () => {
        return (
            <div>
                <label>Group</label>
                <Select
                    onValueChange={(value) => {
                    }}
                    value={''}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id.toString()}>
                                {group.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        );
    };

    const renderSelectPlayersField = () => {
        return (
            <div>
                <label>Players</label>
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
            </div>

        )
            ;
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
                <form
                    onSubmit={onSubmit}
                    className="space-y-4"
                >
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
            </DialogContent>
        </Dialog>
    );
}

