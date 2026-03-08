'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DATE_TIME_FORMAT } from '@/utility/const';
import { useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddGameModal.css';

type SelectedPlayer = {
    id: string;
    points: number;
    is_host: boolean;
};

type FormValues = {
    game_end: Date;
    game_start: Date;
    winner_id: number;
    players: SelectedPlayer[];
};

const CustomDatePickerInput = ({
    value,
    onClick,
    label,
}: {
    value?: string;
    onClick?: () => void;
    label: string;
}) => (
    <div className="relative">
        <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
            onClick={onClick}
        >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value || `Select ${label}`}
        </Button>
    </div>
);

export function AddGameModal({
    groups,
    players,
    showSelectGroup,
    selectedGroupID,
}) {
    const [open, setOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<
        (typeof groups)[0] | null
    >(groups.find((item) => item.id == selectedGroupID));
    const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);

    const syncPlayersToForm = (next: SelectedPlayer[]) => {
        setData('players', next);
    };

    const { data, setData, post, transform, processing, errors, reset } =
        useForm({
            game_start: null,
            game_end: null,
            winner_id: '',
            players: [] as SelectedPlayer[],
            group_id: selectedGroup?.id,
        });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('game.store'), {
            onSuccess: (data) => console.log(data, ' success'),
            onFinish: (smth) => console.log(smth),
        });

        setOpen(false);
        reset();
        setSelectedPlayers([]);
    };

    const selectedIds = selectedPlayers.map((p) => p.id);

    const handleGroupChange = (groupId: string) => {
        const group = groups.find((g) => g.id.toString() === groupId);
        setSelectedGroup(group || null);
        setSelectedPlayers([]);
        setData('winner_id', '');
        setData('players', []);
    };

    const handlePlayerToggle = (playerId: string) => {
        setSelectedPlayers((current) => {
            const exists = current.some((p) => p.id === playerId);
            const updated = exists
                ? current.filter((p) => p.id !== playerId)
                : [...current, { id: playerId, points: 0, is_host: false }];

            if (!updated.some((p) => p.id === String(data.winner_id))) {
                setData('winner_id', '');
            }
            syncPlayersToForm(updated);
            return updated;
        });
    };

    const setPlayerPoints = (playerId: string, points: number) => {
        setSelectedPlayers((current) => {
            const next = current.map((p) =>
                p.id === playerId ? { ...p, points } : p,
            );
            syncPlayersToForm(next);
            return next;
        });
    };

    const setPlayerIsHost = (playerId: string, is_host: boolean) => {
        setSelectedPlayers((current) => {
            const next = current.map((p) => ({
                ...p,
                is_host: p.id === playerId ? is_host : false,
            }));
            syncPlayersToForm(next);
            return next;
        });
    };

    const renderWinnerField = () => {
        return (
            <div>
                <label htmlFor={'winner_id'}>Winner</label>
                <Select
                    onValueChange={(e) => setData('winner_id', e)}
                    value={data.winner_id}
                    disabled={selectedPlayers.length === 0}
                    name="winner_id"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Выберите победителя" />
                    </SelectTrigger>
                    <SelectContent>
                        {players
                            .filter((player) =>
                                selectedIds.includes(player.id.toString()),
                            )
                            .map((player) => {
                                return (
                                    <SelectItem
                                        key={player.id}
                                        value={player.id.toString()}
                                    >
                                        {(
                                            player as {
                                                username?: string;
                                                login?: string;
                                            }
                                        ).username ??
                                            (
                                                player as {
                                                    username?: string;
                                                    login?: string;
                                                }
                                            ).login ??
                                            ''}
                                    </SelectItem>
                                );
                            })}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    const renderGameStartField = () => {
        return (
            <div className="flex flex-col space-y-2">
                <label>Game Start</label>
                <DatePicker
                    selected={data.game_start}
                    onChange={(date) => setData('game_start', date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={DATE_TIME_FORMAT}
                    customInput={
                        <CustomDatePickerInput
                            label="start time"
                            value={
                                data.game_start
                                    ? format(data.game_start, DATE_TIME_FORMAT)
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
            <div className="flex flex-col space-y-2">
                <label>Game End</label>
                <DatePicker
                    className="mt-0"
                    selected={data.game_end}
                    onChange={(date) => {
                        setData('game_end', date);
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={DATE_TIME_FORMAT}
                    customInput={
                        <CustomDatePickerInput
                            label="end time"
                            value={
                                data.game_end
                                    ? format(data.game_end, DATE_TIME_FORMAT)
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
                <Select onValueChange={(value) => {}} value={''}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map((group) => (
                            <SelectItem
                                key={group.id}
                                value={group.id.toString()}
                            >
                                {group.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        );
    };

    const renderSelectPlayersField = () => {
        const displayName = (p: { username?: string; login?: string }) =>
            p.username ?? p.login ?? '';

        return (
            <div className="space-y-3">
                <div>
                    <label>Players</label>
                    <div className="grid grid-cols-2 gap-2">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    checked={selectedIds.includes(
                                        player.id.toString(),
                                    )}
                                    onCheckedChange={() =>
                                        handlePlayerToggle(player.id.toString())
                                    }
                                    id={`player-${player.id}`}
                                />
                                <label
                                    htmlFor={`player-${player.id}`}
                                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {displayName(player)}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <AnimatePresence>
                    {selectedPlayers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                                opacity: 1,
                                height: 'auto',
                            }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{
                                duration: 0.25,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className="overflow-hidden"
                        >
                            <label className="mb-2 block text-sm font-medium">
                                Очки и хост
                            </label>
                            <div className="rounded-md border border-border/60 overflow-hidden">
                                <table className="w-full table-fixed border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                                        <th className="w-[45%] py-2 px-3 font-medium">
                                            Игрок
                                        </th>
                                        <th className="w-[25%] py-2 px-3 font-medium">
                                            Очки
                                        </th>
                                        <th className="w-[30%] py-2 px-3 font-medium">
                                            Хост
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {selectedPlayers.map((entry) => {
                                            const player = players.find(
                                                (p) =>
                                                    p.id.toString() ===
                                                    entry.id,
                                            );
                                            return (
                                                <motion.tr
                                                    key={entry.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: -8,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        y: -4,
                                                    }}
                                                    transition={{
                                                        duration: 0.2,
                                                        ease: [0.4, 0, 0.2, 1],
                                                    }}
                                                    className="border-b border-border/60 last:border-0"
                                                >
                                                    <td className="py-2 px-3 font-medium">
                                                        {player
                                                            ? displayName(
                                                                  player,
                                                              )
                                                            : entry.id}
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step={1}
                                                            className="h-8 w-20"
                                                            value={
                                                                entry.points
                                                            }
                                                            onChange={(e) => {
                                                                const v =
                                                                    e.target.value;
                                                                setPlayerPoints(
                                                                    entry.id,
                                                                    v === ''
                                                                        ? 0
                                                                        : parseInt(
                                                                              v,
                                                                              10,
                                                                          ) ||
                                                                              0,
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="py-2 px-3">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                id={`host-${entry.id}`}
                                                                checked={
                                                                    entry.is_host
                                                                }
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    setPlayerIsHost(
                                                                        entry.id,
                                                                        !!checked,
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`host-${entry.id}`}
                                                                className="cursor-pointer text-sm"
                                                            >
                                                                Хост
                                                            </label>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
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
                    <span>Добавить игру</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[90vh] max-w-[42rem] flex-col overflow-hidden">
                <DialogHeader className="shrink-0">
                    <DialogTitle>Добавить новую игру</DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            {renderGameStartField()}
                            {renderGameEndField()}
                        </div>

                        {showSelectGroup && renderGroupField()}

                        {selectedGroup && (
                            <>
                                {renderSelectPlayersField()}
                                {renderWinnerField()}
                            </>
                        )}
                    </div>

                    <div className="mt-4 flex shrink-0 justify-end space-x-2 border-t border-border pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Добавить игру</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
