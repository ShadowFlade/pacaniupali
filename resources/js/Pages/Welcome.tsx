// import PhotoWall from '@/components/photo-wall'
import { PageProps } from '@/types';
import { useState } from 'react';
import General from '@/Layouts/General';
import SidebarCustom from '@/Components/SidebarCustom';

export default function Welcome({
                                    auth

                                }: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    const [loggedIn, setLoggedIn] = useState(!!auth.user.id);
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <General>
            <SidebarCustom loggedIn={loggedIn} />
        </General>
    );
}
