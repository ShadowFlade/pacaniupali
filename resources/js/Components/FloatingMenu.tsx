'use client';
import { LayoutDashboard, Users, User, Settings } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';

export function FloatingMenu({ username, userEmail, className }) {
    const isLoggedIn = !!username;
    console.log(isLoggedIn,' is logge3d in ');
    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white p-4 shadow-md ` + className}>
            <div className="flex shrink-0 items-center">
                <Link href="/">
                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Admin</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg?height=32&width=32"
                                                 alt="@username"
                                    />
                                    <AvatarFallback>{username?.at(0)}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{username}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userEmail}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <NavLink
                                    className={' pl-0'}
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <NavLink
                                    className={' pl-0'}
                                    href={route('group.index')}
                                    active={route().current('group.index')}
                                >Группа</NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <NavLink
                                    className={' pl-0'}
                                    href={route('profile.edit')}
                                    active={route().current('profile.edit')}
                                >
                                    Профиль
                                </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <NavLink
                                    className={' pl-0'}
                                    href={route('setting.index')}
                                    active={route().current('setting.index')}
                                >
                                    Настройки
                                </NavLink>
                            </DropdownMenuItem>
                            {
                                isLoggedIn && (     <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    <NavLink
                                        className={' pl-0'}
                                        href={route('logout')}
                                        active={route().current('group.index')}
                                    >Выйти</NavLink>
                                </DropdownMenuItem>)
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {
                    username ? <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        Log Out
                    </Link> : null
                }

            </div>

        </nav>
    );
}

