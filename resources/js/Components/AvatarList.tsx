import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DEFAULT_AVATAR_PATH } from '@/utility/const';
import AvatarSmall from '@/Components/AvatarSmall';

interface Player {
    user: {
        id: number
        login: string
        username: string
        picture?: string
    };

}

interface AvatarListProps {
    players: Player[];
    maxAvatars?: number;
    overlap?: number;
}

export function AvatarList({ players, maxAvatars = 5, overlap = 16 }: AvatarListProps) {
    const displayUsers = players.slice(0, maxAvatars);
    const remainingCount = players.length - maxAvatars;

    return (
        <div className="flex items-center">
            <div className="flex -space-x-4">
                {displayUsers.map((player) => (
                    <div key={player.user.id} className="relative rounded-full border-2 border-background">
                        <AvatarSmall picture={player.user.picture || DEFAULT_AVATAR_PATH}
                                     username={player.user.username} />
                    </div>
                ))}
                {remainingCount > 0 && (
                    <div className="relative flex h-8 w-8 items-center
                    justify-center rounded-full border-2 border-background
                    bg-muted text-xs font-medium"
                    >
                        +{remainingCount}
                    </div>
                )}
            </div>
        </div>
    );
}
