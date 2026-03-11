'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { useState } from 'react';

export type GroupUser = {
    id: number | string;
    username?: string;
    login?: string;
};

export type GroupWithUsers = {
    id: number | string;
    name: string;
    description?: string | null;
    logo_path?: string | null;
    users?: GroupUser[];
};

type AllGroupsWithUsersDropdownProps = {
    groups: GroupWithUsers[];
};

function displayName(u: GroupUser): string {
    return u.username ?? u.login ?? String(u.id);
}

export function AllGroupsWithUsersDropdown({
    groups,
}: AllGroupsWithUsersDropdownProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (groups.length === 0) {
        return (
            <p className="text-muted-foreground py-6 text-center text-sm">
                Нет групп
            </p>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Группы</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {groups.map((group) => {
                    const users = group.users ?? [];
                    const isExpanded = expandedId === String(group.id);

                    return (
                        <Card key={String(group.id)} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-start gap-3">
                                    <img
                                        src={
                                            group.logo_path || '/placeholder.svg'
                                        }
                                        alt={`${group.name} logo`}
                                        className="h-12 w-12 shrink-0 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <Link
                                            href={`/group/${group.id}`}
                                            className="font-semibold hover:underline"
                                        >
                                            {group.name}
                                        </Link>
                                        {group.description ? (
                                            <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
                                                {group.description}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex w-full cursor-pointer items-center justify-between text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    onClick={() =>
                                        setExpandedId((id) =>
                                            id === String(group.id)
                                                ? null
                                                : String(group.id),
                                        )
                                    }
                                >
                                    <span className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Участники ({users.length})
                                    </span>
                                    {isExpanded ? (
                                        <ChevronUp className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <ChevronDown className="h-4 w-4 shrink-0" />
                                    )}
                                </Button>
                                {isExpanded && (
                                    <ul className="mt-2 space-y-1 border-t border-border/60 pt-2">
                                        {users.length === 0 ? (
                                            <li className="text-muted-foreground text-sm">
                                                Нет участников
                                            </li>
                                        ) : (
                                            users.map((user) => (
                                                <li
                                                    key={String(user.id)}
                                                    className="text-sm"
                                                >
                                                    {displayName(user)}
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
