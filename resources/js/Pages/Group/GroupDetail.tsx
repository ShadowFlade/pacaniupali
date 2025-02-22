import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ImageIcon } from 'lucide-react';
import SidebarCustom from '@/Components/SidebarCustom';
import { usePage, router, useForm } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import General from '@/Layouts/General';

interface Group {
    id: string;
    name: string;
    logo: string;
    description: string;
}

interface Game {
    id: string;
    date: string;
    teams: string;
    score: string;
}

export default function GroupsPage({auth}) {
    const page = usePage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        logo: '',
        description: '',
    });
    const searchParams = new URLSearchParams(window.location.search);
    const [showFormState,setShowFormState] = useState<boolean>(searchParams.get('creating') === 'true');

    //TODO:mb refactor it into custom hook like nextjs searchParams to detect url changes
    const setShowForm = (show: boolean) => {
        const params = new URLSearchParams(searchParams)
        if (show) {
            params.set("creating", "true")
        } else {
            params.delete("creating")
        }
        setShowFormState(true);
        window.history.replaceState(null, '', page.url + '/?' + params.toString());

    }
    const [loggedIn, setLoggedIn] = useState(!!auth.user?.id);

    const [groups, setGroups] = useState<Group[]>([]);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    // Mock games data - replace with real data
    const mockGames: Game[] = [
        { id: '1', date: '2024-02-22', teams: 'Team A vs Team B', score: '3-2' },
        { id: '2', date: '2024-02-20', teams: 'Team C vs Team D', score: '1-1' },
        { id: '3', date: '2024-02-18', teams: 'Team B vs Team C', score: '2-0' }
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route())
        const formData = new FormData(e.currentTarget);
        const newGroup = {
            id: Date.now().toString(),
            name: formData.get('name') as string,
            logo: '/placeholder.svg?height=100&width=100',
            description: formData.get('description') as string
        };
        setGroups([...groups, newGroup]);
        setShowForm(false);
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
                        <Button onClick={() => setShowForm(true)}>Create Group</Button>
                    </div>
                ) : null}

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
                            <Card className="max-w-2xl mx-auto mb-8">
                                <CardHeader>
                                    <h2 className="text-2xl font-semibold">Создать группу</h2>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Название группы</Label>
                                            <Input id="name" name="name" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="logo">Логотип группы</Label>
                                            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors">
                                                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <p className="mt-2 text-sm text-muted-foreground">Нажмите чтобы загурзить логотип</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Описание</Label>
                                            <Textarea id="description" name="description" required />
                                            <p className="mt-2 text-sm text-muted-foreground">Сюда вы можете записать свой лозунг!</p>

                                        </div>

                                        <div className="flex gap-4">
                                            <Button type="submit">Создать группу</Button>
                                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                                                Отменить
                                            </Button>
                                        </div>
                                    </form>
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
                                <Card className="overflow-hidden">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={group.logo || "/placeholder.svg"}
                                                alt={`${group.name} logo`}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <Link href={`/groups/${group.id}`} className="text-xl font-semibold hover:underline">
                                                        {group.name}
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                                                    >
                                                        {expandedGroup === group.id ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <p className="text-muted-foreground mt-1">{group.description}</p>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {expandedGroup === group.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t">
                                                        <h3 className="font-semibold mb-3">Recent Games</h3>
                                                        <div className="space-y-2">
                                                            {mockGames.map((game) => (
                                                                <div
                                                                    key={game.id}
                                                                    className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                                                                >
                                                                    <span>{game.teams}</span>
                                                                    <span className="font-medium">{game.score}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {groups.length > 0 && !showFormState && (
                    <div className="mt-6 text-center">
                        <Button onClick={() => setShowForm(true)}>Create Another Group</Button>
                    </div>
                )}
            </div>
        </General>
    );
}

