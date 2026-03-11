// import PhotoWall from '@/components/photo-wall'
import { AllGroupsWithUsersDropdown } from '@/Components/AllGroupsWithUsersDropdown';
import type { GroupWithUsers } from '@/Components/AllGroupsWithUsersDropdown';
import SidebarCustom from '@/Components/SidebarCustom';
import General from '@/Layouts/General';
import { PageProps } from '@/types';
import { useState } from 'react';

const MOCK_GROUPS: GroupWithUsers[] = [
    {
        id: 1,
        name: 'Weekend Warriors',
        description: 'Играем по выходным',
        logo_path: null,
        users: [
            { id: 1, username: 'alice' },
            { id: 2, username: 'bob' },
            { id: 3, username: 'charlie' },
        ],
    },
    {
        id: 2,
        name: 'Night Owls',
        description: 'Поздние игры после работы',
        logo_path: null,
        users: [
            { id: 4, username: 'diana' },
            { id: 5, username: 'eve' },
        ],
    },
    {
        id: 3,
        name: 'dmc',
        description: 'hey ya',
        logo_path: null,
        users: [{ id: 6, username: 'king' }],
    },
];

export default function Welcome({
    auth,
    groups = [],
}: PageProps<{
    laravelVersion?: string;
    phpVersion?: string;
    groups?: GroupWithUsers[];
}>) {
    const [loggedIn, setLoggedIn] = useState(!!auth.user?.id);
    const groupsToShow = groups.length > 0 ? groups : MOCK_GROUPS;
    console.log(groups, ' groups');

    return (
        <General>
            <SidebarCustom loggedIn={loggedIn} />
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <AllGroupsWithUsersDropdown groups={groupsToShow} />
            </div>
        </General>
    );
}
