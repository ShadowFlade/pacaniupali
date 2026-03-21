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
import { CalendarIcon, PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddGameModal.css';

/** Минимум строк в таблице статистики (реальные + пустые слоты), чтобы высота не прыгала при 1–5 игроках */
const STATS_TABLE_MIN_ROWS = 5;

const ADD_GAME_DATE_PICKER_SHARED = {
    portalId: 'react-datepicker-add-game-portal',
    popperProps: { strategy: 'fixed' as const },
    popperClassName: 'add-game-datepicker-popper',
} as const;

type SelectedPlayer = {
    id: string;
    points: number;
    points_earned?: number;
    points_lost?: number;
    right_answers?: number;
    wrong_answers?: number;
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
    const [touched, setTouched] = useState({ game_start: false });
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

        setTouched((prev) => ({ ...prev, game_start: true }));
        if (!data.game_start) {
            return;
        }

        transform((formData) => ({
            ...formData,
            players: formData.players.map((player) =>
                player.is_host
                    ? {
                          ...player,
                          points: 0,
                          points_earned: 0,
                          points_lost: 0,
                          right_answers: 0,
                          wrong_answers: 0,
                      }
                    : player,
            ),
        }));

        post(route('game.store'), {
            onSuccess: (data) => console.log(data, ' success'),
            onFinish: (smth) => console.log(smth),
        });

        setOpen(false);
        reset();
        setSelectedPlayers([]);
        setTouched({ game_start: false });
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
                : [
                      ...current,
                      {
                          id: playerId,
                          points: 0,
                          points_earned: 0,
                          points_lost: 0,
                          right_answers: 0,
                          wrong_answers: 0,
                          is_host: false,
                      },
                  ];

            if (!updated.some((p) => p.id === String(data.winner_id))) {
                setData('winner_id', '');
            }
            syncPlayersToForm(updated);
            return updated;
        });
    };

    const setPlayerTotalPoints = (playerId: string, points: number) => {
        setSelectedPlayers((current) => {
            const next = current.map((p) =>
                p.id === playerId ? { ...p, points } : p,
            );
            syncPlayersToForm(next);
            return next;
        });
    };

    const setPlayerPointsEarned = (playerId: string, points_earned: number) => {
        setSelectedPlayers((current) => {
            const next = current.map((p) =>
                p.id === playerId ? { ...p, points_earned } : p,
            );
            syncPlayersToForm(next);
            return next;
        });
    };

    const setPlayerStat = (
        playerId: string,
        field: keyof Pick<
            SelectedPlayer,
            'points_lost' | 'right_answers' | 'wrong_answers'
        >,
        value: number,
    ) => {
        setSelectedPlayers((current) => {
            const next = current.map((p) =>
                p.id === playerId ? { ...p, [field]: value } : p,
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
                ...(p.id === playerId && is_host
                    ? {
                          points: 0,
                          points_earned: 0,
                          points_lost: 0,
                          right_answers: 0,
                          wrong_answers: 0,
                      }
                    : {}),
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
                            .filter(
                                (player) =>
                                    !selectedPlayers.some(
                                        (selectedPlayer) =>
                                            selectedPlayer.id ===
                                                player.id.toString() &&
                                            selectedPlayer.is_host,
                                    ),
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
        const gameStartError =
            touched.game_start && !data.game_start
                ? 'Укажите время начала игры'
                : '';

        return (
            <div className="flex flex-col space-y-2">
                <label>Game Start</label>
                <DatePicker
                    {...ADD_GAME_DATE_PICKER_SHARED}
                    selected={data.game_start}
                    onChange={(date) => {
                        setData('game_start', date);
                        setTouched((prev) => ({ ...prev, game_start: true }));
                    }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat={DATE_TIME_FORMAT}
                    onCalendarOpen={() =>
                        setTouched((prev) => ({ ...prev, game_start: true }))
                    }
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
                <div className="min-h-[22px]">
                    {gameStartError ? (
                        <p className="text-sm text-destructive">
                            {gameStartError}
                        </p>
                    ) : null}
                </div>
            </div>
        );
    };

    const renderGameEndField = () => {
        return (
            <div className="flex flex-col space-y-2">
                <label>Game End</label>
                <DatePicker
                    {...ADD_GAME_DATE_PICKER_SHARED}
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
                <div className="min-h-[22px]" aria-hidden />
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

        /* Всегда держим в таблице ровно 5 «слотов» строк данных — высота блока не меняется при 0–5 игроках */
        const statsPlaceholderRows = Math.max(
            0,
            STATS_TABLE_MIN_ROWS - selectedPlayers.length,
        );

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
                <div
                    className={
                        selectedPlayers.length === 0
                            ? 'opacity-60'
                            : ''
                    }
                >
                    <label className="mb-2 block text-sm font-medium">
                        Очки, статистика и хост
                    </label>
                    <div className="text-muted-foreground mb-2 flex h-8 items-center text-xs">
                        {selectedPlayers.length === 0
                            ? 'Отметьте игроков выше, чтобы заполнить строки'
                            : ''}
                    </div>
                    <div className="rounded-md border border-border/60 text-sm">
                                <table className="w-full table-fixed border-collapse">
                                    <colgroup>
                                        <col style={{ width: '18%' }} />
                                        <col style={{ width: '12%' }} />
                                        <col style={{ width: '12%' }} />
                                        <col style={{ width: '12%' }} />
                                        <col style={{ width: '12%' }} />
                                        <col style={{ width: '12%' }} />
                                        <col style={{ width: '22%' }} />
                                    </colgroup>
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                                            <th className="py-2 px-3 text-left font-medium">Игрок</th>
                                            <th className="py-2 px-2 text-left font-medium">
                                                <span
                                                    className="inline-block w-full max-w-[5rem] text-left"
                                                    title="Всего очков набрано за игру"
                                                >
                                                    Всего очков
                                                </span>
                                            </th>
                                            <th className="py-2 px-2 text-left font-medium">
                                                <span className="inline-block w-full max-w-[5rem] text-left" title="Очков заработано">
                                                    Заработанные очки
                                                </span>
                                            </th>
                                            <th className="py-2 px-2 text-left font-medium">
                                                <span className="inline-block w-full max-w-[5rem] left" title="Очков потеряно">
                                                    Потерянные очки
                                                </span>
                                            </th>
                                            <th className="py-2 px-2 text-left font-medium">
                                                <span className="inline-block w-full max-w-[5rem] text-left" title="Правильных ответов">
                                                    Правильных ответов
                                                </span>
                                            </th>
                                            <th className="py-2 px-2 text-left font-medium">
                                                <span className="inline-block w-full max-w-[5rem] text-left" title="Неправильных ответов">
                                                    Неправильных ответов
                                                </span>
                                            </th>
                                            <th className="py-2 px-3 text-left font-medium">Хост</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {selectedPlayers.map((entry) => {
                                                const player = players.find(
                                                    (p) => p.id.toString() === entry.id,
                                                );
                                                const num = (v: string) => {
                                                    if (v === '' || v === '-') {
                                                        return 0;
                                                    }
                                                    const n = Number(v);
                                                    return Number.isFinite(n) ? n : 0;
                                                };
                                                return (
                                                    <tr
                                                        key={entry.id}
                                                        className="border-border/60 border-b last:border-0"
                                                    >
                                                        <td className="min-w-0 px-3 py-2">
                                                            <span
                                                                className="block truncate font-medium"
                                                                title={
                                                                    player
                                                                        ? displayName(
                                                                              player,
                                                                          )
                                                                        : entry.id
                                                                }
                                                            >
                                                                {player
                                                                    ? displayName(
                                                                          player,
                                                                      )
                                                                    : entry.id}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                step="any"
                                                                className="h-8 w-full max-w-[5rem] text-left"
                                                                value={entry.points}
                                                                disabled={entry.is_host}
                                                                onChange={(e) =>
                                                                    setPlayerTotalPoints(
                                                                        entry.id,
                                                                        num(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                step="any"
                                                                className="h-8 w-full max-w-[5rem] text-left"
                                                                value={
                                                                    entry.points_earned ??
                                                                    0
                                                                }
                                                                disabled={entry.is_host}
                                                                onChange={(e) =>
                                                                    setPlayerPointsEarned(
                                                                        entry.id,
                                                                        num(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                step="any"
                                                                className="h-8 w-full max-w-[5rem] text-left"
                                                                value={
                                                                    entry.points_lost ??
                                                                    0
                                                                }
                                                                disabled={entry.is_host}
                                                                onChange={(e) =>
                                                                    setPlayerStat(
                                                                        entry.id,
                                                                        'points_lost',
                                                                        num(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                step="any"
                                                                className="h-8 w-full max-w-[5rem] text-left"
                                                                value={
                                                                    entry.right_answers ??
                                                                    0
                                                                }
                                                                disabled={entry.is_host}
                                                                onChange={(e) =>
                                                                    setPlayerStat(
                                                                        entry.id,
                                                                        'right_answers',
                                                                        num(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-2 py-2 text-right">
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                step="any"
                                                                className="h-8 w-full max-w-[5rem] text-left"
                                                                value={
                                                                    entry.wrong_answers ??
                                                                    0
                                                                }
                                                                disabled={entry.is_host}
                                                                onChange={(e) =>
                                                                    setPlayerStat(
                                                                        entry.id,
                                                                        'wrong_answers',
                                                                        num(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2">
                                                            <div className="flex items-center gap-2">
                                                                <label
                                                                    htmlFor={`host-${entry.id}`}
                                                                    className="cursor-pointer"
                                                                >
                                                                    Хост
                                                                </label>
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        {Array.from({
                                            length: statsPlaceholderRows,
                                        }).map((_, i) => (
                                            <tr
                                                key={`stats-placeholder-${i}`}
                                                aria-hidden
                                                className="pointer-events-none border-border/60 border-b last:border-0"
                                            >
                                                <td className="min-w-0 px-3 py-2">
                                                    <span className="invisible inline-block h-8">
                                                        —
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <div className="h-8" />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <div className="h-8" />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <div className="h-8" />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <div className="h-8" />
                                                </td>
                                                <td className="px-2 py-2 text-right">
                                                    <div className="h-8" />
                                                </td>
                                                <td className="px-3 py-2">
                                                    <div className="h-8" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                </div>
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
            <DialogContent className="max-w-5xl overflow-visible">
                <div className="flex max-h-[90vh] flex-col overflow-y-auto overflow-x-hidden">
                    <DialogHeader className="shrink-0">
                        <DialogTitle>Добавить новую игру</DialogTitle>
                    </DialogHeader>
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col"
                    >
                        <div className="space-y-4 pr-1">
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
                </div>
                {/*
                  Календарь должен монтироваться внутри DialogContent: иначе портал на document.body
                  попадает под блокировку pointer-events у Radix (модалка), и дата/время не кликаются.
                */}
                <div
                    id="react-datepicker-add-game-portal"
                    className="absolute bottom-0 right-4 h-0 w-0 overflow-visible"
                />
            </DialogContent>
        </Dialog>
    );
}
