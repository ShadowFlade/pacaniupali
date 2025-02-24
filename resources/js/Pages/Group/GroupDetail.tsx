import type React from 'react';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ImageIcon, FileImage, X } from 'lucide-react';
import SidebarCustom from '@/Components/SidebarCustom';
import { usePage, router, useForm, Link } from '@inertiajs/react';
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

export default function GroupsPage({auth, user_group}) {
    const page = usePage();
    console.log(user_group,' groups', page, ' page');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        logo: '',
        description: '',
    });
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
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

    const [groups, setGroups] = useState<Group[]>(user_group);
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    // Mock games data - replace with real data
    const mockGames: Game[] = [
        { id: '1', date: '2024-02-22', teams: 'Team A vs Team B', score: '3-2' },
        { id: '2', date: '2024-02-20', teams: 'Team C vs Team D', score: '1-1' },
        { id: '3', date: '2024-02-18', teams: 'Team B vs Team C', score: '2-0' }
    ];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('group.store'), {
            onFinish: (is) => {
                console.log(is,' is');
                reset();
                setShowForm(false)
            },
        })
        const formData = new FormData(e.currentTarget);
        // const newGroup = {
        //     id: Date.now().toString(),
        //     name: formData.get('name') as string,
        //     logo: '/placeholder.svg?height=100&width=100',
        //     description: formData.get('description') as string
        // };
        // setGroups([...groups, newGroup]);
        setShowForm(false);
    };

    const handleFile = useCallback((file: File | undefined) => {
        if (!file) return

        if (!file.type.startsWith("image/")) {
            alert("Please upload an image file")
            return
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("File size must be less than 2MB")
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }, [])

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
                                            <Input id="name" name="name" required onChange={e => setData('name',e.target.value)}/>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="logo">Group Logo</Label>
                                            <div
                                                className={`
                        border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out
                        ${dragActive ? "border-primary bg-primary/5 scale-102" : "border-muted-foreground/25"}
                        ${preview ? "p-2" : "p-8"}
                      `}
                                                onDragOver={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setDragActive(true)
                                                }}
                                                onDragLeave={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setDragActive(false)
                                                }}
                                                onDrop={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setDragActive(false)
                                                    const file = e.dataTransfer.files?.[0]
                                                    handleFile(file)
                                                }}
                                            >
                                                <input
                                                    id="logo"
                                                    name="logo"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        handleFile(e.target.files?.[0]);
                                                        setData('logo', e.target.files?.[0]);
                                                    }}
                                                />
                                                {preview ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={preview || "/placeholder.svg"}
                                                            alt="Preview"
                                                            className="w-full h-48 object-cover rounded-md"
                                                        />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-white hover:text-white hover:bg-white/20"
                                                                onClick={() => {
                                                                    setPreview(null)
                                                                    const input = document.getElementById("logo") as HTMLInputElement
                                                                    if (input) input.value = ""
                                                                }}
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label htmlFor="logo" className="flex flex-col items-center gap-2 cursor-pointer">
                                                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                                                            <FileImage className="h-6 w-6" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Click to upload or drag and drop
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 2MB)</p>
                                                        </div>
                                                    </label>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Описание</Label>
                                            <Textarea id="description"
                                                      name="description"
                                                      required
                                                      onChange={e => setData('description',e.target.value)}
                                            />
                                            <p className="mt-2 text-sm text-muted-foreground">Сюда вы можете записать свой лозунг!</p>

                                        </div>

                                        <div className="flex gap-4">
                                            <Button disabled={processing} type="submit">Создать группу</Button>
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

