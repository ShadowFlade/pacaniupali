'use client';
import React, { useEffect } from 'react';

import FileInput from '@/Components/FileInput';
import GroupListItem from '@/Components/GroupListItem';
import SidebarCustom from '@/Components/SidebarCustom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import General from '@/Layouts/General';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { ComboboxPopup } from '@/Components/ComboboxPopup';

interface Group {
    id: string;
    name: string;
    code: string;
    logo_path: string;
    description: string;
}

interface Game {
    id: string;
    date: string;
    group: Group[];
    points: number;
}

export default function GroupList({ auth, groups: userGroups, games }) {
    const page = usePage<PageProps>();
    console.log(auth, ' auth');

    const { data, setData, post, processing, reset } = useForm({
        name: '',
        logo: '',
        description: '',
        /** UserGroupPublicity: PUBLIC = 1, PRIVATE = 2 */
        publicity: 1,
    });

    useEffect(() => {
        const groups: Group[] = page.props.groups as any;
        setGroups(groups);
    }, []);

    const [showFormState, setShowFormState] = useState(
        page.props.creating || false,
    );
    const [loggedIn, setLoggedIn] = useState(!!auth.user?.id);
    const [groups, setGroups] = useState<Group[]>(userGroups || []);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    const setShowForm = (show: boolean) => {
        setShowFormState(show);
        console.log('set show form!!');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('group.store'), {
            onFinish: (data) => {
                reset();
                setShowForm(false);
            },
            onSuccess: (data) => {
                const groups: Group[] = page.props.groups as any
                setGroups(groups);
            },
        });
        setShowForm(false);
    };

    const renderCreateGroupForm = () => {
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Название группы</Label>
                    <Input
                        id="name"
                        name="name"
                        required
                        onChange={(e) => setData('name', e.target.value)}
                    />
                </div>

                <FileInput
                    label="Лого группы"
                    setData={setData}
                    inputName="logo"
                />

                <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                        id="description"
                        name="description"
                        required
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                        Сюда вы можете записать свой лозунг!
                    </p>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="publicity">Публичность</Label>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:text-foreground inline-flex size-5 items-center justify-center rounded-full border border-current transition-colors"
                                        aria-label="Справка о публичности группы"
                                    >
                                        <span className="text-[10px] font-semibold leading-none">
                                            i
                                        </span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="top"
                                    className="max-w-xs text-pretty"
                                >
                                    Публичные группы будут видны в списке групп
                                    всем пользователям, и все пользователи могут
                                    оставлять заявки на присоединение.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Select
                        value={String(data.publicity)}
                        onValueChange={(v) =>
                            setData('publicity', Number(v) as 1 | 2)
                        }
                    >
                        <SelectTrigger id="publicity" className="w-full">
                            <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Публичная</SelectItem>
                            <SelectItem value="2">Приватная</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-4">
                    <Button disabled={processing} type="submit">
                        Создать группу
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                    >
                        Отменить
                    </Button>
                </div>
            </form>
        );
    };

    return (
        <General>
            {!loggedIn && <SidebarCustom loggedIn={loggedIn} />}
            <div className="container mx-auto px-4 py-8">
                {groups.length === 0 && !showFormState ? (
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-semibold">
                            Looks like вы не состоите ни в какой группе. Давайте
                            создадим вашу первую группу!
                        </h2>
                        <Button onClick={() => setShowForm(true)}>
                            Создать группу
                        </Button>
                    </div>
                ) : null}

                {groups.length > 0 && !showFormState && (
                    <div className="mt-6 text-center">
                        <Button onClick={() => setShowForm(true)}>
                            Создать группу
                        </Button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {showFormState && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                        >
                            <Card className="mx-auto mb-8 max-w-2xl">
                                <CardHeader>
                                    <h2 className="text-2xl font-semibold">
                                        Создать группу
                                    </h2>
                                </CardHeader>
                                <CardContent>
                                    {renderCreateGroupForm()}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-6 grid gap-6">
                    <AnimatePresence>
                        {groups.map((group) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <GroupListItem
                                    group={group}
                                    groups={groups}
                                    expandedGroup={expandedGroup}
                                    setExpandedGroup={setExpandedGroup}
                                    games={games}
                                    currUserID={auth.user?.id}
                                    players={[]}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </General>
    );
}
