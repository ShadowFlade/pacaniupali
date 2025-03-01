import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEFAULT_AVATAR_PATH } from '@/utility/const';
import type React from 'react';

export default function AvatarSmall({ picture, username }) {
    return (
        <Avatar>
            <AvatarImage
                src={picture || DEFAULT_AVATAR_PATH}
                alt={username}
                title={username}
                className=""
            />
            <AvatarFallback title={username}>
                {username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
            </AvatarFallback>
        </Avatar>
    );
}
