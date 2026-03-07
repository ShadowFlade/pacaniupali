import AvatarSmall from '@/Components/AvatarSmall';
import { DEFAULT_AVATAR_PATH } from '@/utility/const';
import { format } from 'date-fns';
import { DATE_FORMAT } from '@/utility/const';

export type GroupMember = {
    id: number;
    username?: string;
    login?: string;
    picture?: string;
    created_at?: string | null;
    joined_at?: string | null;
    wins_count?: number | null;
};

type GroupMembersListProps = {
    members: GroupMember[];
};

function formatDate(value: string | null | undefined): string {
    if (value == null || value === '') return '—';
    try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : format(date, DATE_FORMAT);
    } catch {
        return value;
    }
}

function MemberRow({ member }: { member: GroupMember }) {
    const displayName = member.username  ?? '—';
    const wins = member.wins_count ?? 0;

    return (
        <div className="flex flex-wrap items-center gap-4 border-b border-border/60 py-3 last:border-0">
            <AvatarSmall
                picture={member.picture ?? DEFAULT_AVATAR_PATH}
                username={displayName}
            />
            <div className="min-w-0 flex-1">
                <p className="font-medium">{displayName}</p>
                <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-0 text-sm text-muted-foreground">
                    <span>Создан: {formatDate(member.created_at)}</span>
                    <span>В группе с: {formatDate(member.joined_at)}</span>
                    <span>Побед: {wins}</span>
                </dl>
            </div>
        </div>
    );
}

export function GroupMembersList({ members }: GroupMembersListProps) {
    console.log(members,' members');
    if (members.length === 0) {
        return (
            <p className="py-4 text-center text-sm text-muted-foreground">
                Нет участников
            </p>
        );
    }

    return (
        <div className="divide-y-0">
            {members.map((member) => (
                <MemberRow key={member.id} member={member} />
            ))}
        </div>
    );
}
