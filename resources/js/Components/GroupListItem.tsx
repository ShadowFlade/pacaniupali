// @ts-nocheck
import { AddGameModal } from '@/Components/Modals/AddGameModal/AddGameModal';
import { AddUserToGroupModal } from '@/Components/Modals/AddUserToGroupModal/AddUserToGroupModal';
import RecentGamesList from '@/Components/RecentGamesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function GroupListItem({
    group,
    games,
    expandedGroup,
    setExpandedGroup,
    currUserID,
    players,
    groups,
}) {
    console.log(group, ' group');
    const [userGroupUsers, setUserGroupUsers] = useState(group.users);
    console.log(userGroupUsers, ' user group users');
    const AddGameButton = ({ groupId }: { groupId: number }) => {
        return (
            <Button
                variant="secondary"
                size="sm"
                className="hover:bg-secondary-foreground hover:text-secondary flex items-center gap-1 transition-colors duration-200 active:scale-95"
            >
                <PlusCircle className="h-4 w-4" />
                <span>Добавить игру</span>
            </Button>
        );
    };

    const AddUserButton = ({ groupId }: { groupId: number }) => {
        const className =
            'hover:bg-secondary-foreground hover:text-secondary flex items-center gap-1 transition-colors duration-200 active:scale-95';
        return (
            <Button variant="secondary" size="sm" className={className}>
                <PlusCircle className="h-4 w-4" />
                <span>Add User</span>
            </Button>
        );
    };

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div>
                    <div className="flex items-start gap-4">
                        <img
                            src={group.logo_path || '/placeholder.svg'}
                            alt={`${group.name} logo`}
                            className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/groups/${group.id}`}
                                    className="text-xl font-semibold hover:underline"
                                >
                                    {group.name}
                                </Link>
                                {games.length ? (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            setExpandedGroup(
                                                expandedGroup === group.id
                                                    ? null
                                                    : group.id,
                                            )
                                        }
                                    >
                                        {expandedGroup === group.id ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </Button>
                                ) : null}
                            </div>
                            <p className="text-muted-foreground mt-1">
                                {group.description}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p>
                            <span>Игр: </span> <span>{games.length}</span>
                        </p>
                        <span>Участников: </span>{' '}
                        <span>{userGroupUsers.length}</span>
                    </div>

                    <div className="mt-6 flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/group/${group.id}`}>
                                    View Details
                                </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/group/${group.id}/stats`}>
                                    View Stats
                                </Link>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <AddUserToGroupModal
                                groupId={group.id}
                                setUsergroupUsers={setUserGroupUsers}
                                userGroupUsers={userGroupUsers}
                            />
                            <AddGameModal
                                players={group.users}
                                groups={groups}
                                currUserID={currUserID}
                                showSelectGroup={false}
                                selectedGroupID={group.id}
                            />
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {expandedGroup === group.id && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 border-t pt-4">
                                <h3 className="mb-3 font-semibold">
                                    Recent Games
                                </h3>
                                <div className="space-y-2">
                                    {games.length ? (
                                        <RecentGamesList
                                            games={games.filter(
                                                (game) =>
                                                    game.group_id == group.id,
                                            )}
                                            currentUserID={currUserID}
                                            groupID={group.id}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
