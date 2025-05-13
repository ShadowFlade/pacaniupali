'use client';
import React, { useEffect } from 'react';

import FileInput from '@/Components/FileInput';
import GroupListItem from '@/Components/GrouListItem';
import SidebarCustom from '@/Components/SidebarCustom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import General from '@/Layouts/General';
import { PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

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

export default function GroupsList({ auth, groups: userGroups, games }) {
    const page = usePage<PageProps>();

    console.log(page, ' page');
    const { setData, post, processing, reset } = useForm({
        name: '',
        logo: '',
        description: '',
    });
    useEffect(() => {
        setGroups(page.props.groups);
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
                setGroups(data.props.groups);
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
            <SidebarCustom loggedIn={loggedIn} />
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
