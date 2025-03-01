import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import SidebarCustom from '@/Components/SidebarCustom';
import { usePage, router, useForm, Link } from '@inertiajs/react';
import General from '@/Layouts/General';
import FileInput from '@/Components/FileInput';
import GroupListItem from '@/Components/GrouListItem';

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
    const page = usePage();
    console.log(page, ' page');
    console.log(games, ' SUPER GAMES');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        logo: '',
        description: ''
    });

    const searchParams = new URLSearchParams(window.location.search);
    const [showFormState, setShowFormState] = useState<boolean>(searchParams.get('creating') === 'true');
    const [loggedIn, setLoggedIn] = useState(!!auth.user?.id);
    const [groups, setGroups] = useState<Group[]>(userGroups || []);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    //TODO:mb refactor it into custom hook like nextjs searchParams to detect url changes
    const setShowForm = (show: boolean) => {
        const params = new URLSearchParams(searchParams);
        if (show) {
            params.set('creating', 'true');
        } else {
            params.delete('creating');
        }
        setShowFormState(true);
        window.history.replaceState(null, '', page.url + '/?' + params.toString());
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('group.store'), {
            onFinish: (is) => {
                console.log(is, ' is');
                reset();
                setShowForm(false);
            }
        });
        const formData = new FormData(e.currentTarget);
        setShowForm(false);
    };

    const renderCreateGroupForm = () => {
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Название группы</Label>
                    <Input id="name" name="name" required
                           onChange={e => setData('name', e.target.value)} />
                </div>

                <FileInput label="Лого группы"
                           setData={setData}
                           inputName="logo"
                />

                <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea id="description"
                              name="description"
                              required
                              onChange={e => setData('description', e.target.value)}
                    />
                    <p className="mt-2 text-sm text-muted-foreground">Сюда вы можете записать
                        свой лозунг!</p>

                </div>

                <div className="flex gap-4">
                    <Button disabled={processing} type="submit">Создать группу</Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                        Отменить
                    </Button>
                </div>
            </form>

        );
    };


    return (
        <General>
            <SidebarCustom loggedIn={loggedIn} />
            <div className="container mx-auto py-8 px-4">
                {groups.length === 0 && !showFormState ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">
                            Looks like вы не состоите ни в какой группе. Давайте создадим вашу первую группу!
                        </h2>
                        <Button onClick={() => setShowForm(true)}>Создать группу</Button>
                    </div>
                ) : null}

                {groups.length > 0 && !showFormState && (
                    <div className="mt-6 text-center">
                        <Button onClick={() => setShowForm(true)}>Создать группу</Button>
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
                                ease: [0.4, 0, 0.2, 1]
                            }}
                        >
                            <Card className="max-w-2xl mx-auto mb-8">
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

                <div className="grid gap-6 mt-6">
                    <AnimatePresence>
                        {groups.map((group) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <GroupListItem group={group}
                                               groups={groups}
                                               expandedGroup={expandedGroup}
                                               setExpandedGroup={setExpandedGroup}
                                               games={games}
                                               currUserID={auth.user?.id}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>


            </div>
        </General>
    );
}

