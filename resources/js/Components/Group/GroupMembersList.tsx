import AvatarSmall from '@/Components/AvatarSmall';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { DATE_FORMAT, DEFAULT_AVATAR_PATH } from '@/utility/const';
import { format } from 'date-fns';
import { DATE_TIME_FORMAT } from '@/utility/const';

export type GroupMember = {
    id: number;
    username?: string;
    login?: string;
    picture?: string;
    created_at?: string | null;
    joined_group_at?: string | null;
    wins?: any[];
};

type GroupMembersListProps = {
    members: GroupMember[];
    editable?: boolean;
    onRemoveMember?: (id: number) => void;
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

function MemberRow({
    member,
    editable,
    onRemoveMember,
}: {
    member: GroupMember;
    editable?: boolean;
    onRemoveMember?: (id: number) => void;
}) {
    const displayName = member.username ?? member.login ?? '—';
    const wins = member.wins?.length ?? 0;

    return (
        <div className="border-border/60 flex flex-wrap items-center gap-4 border-b py-3 last:border-0">
            <AvatarSmall
                picture={member.picture ?? DEFAULT_AVATAR_PATH}
                username={displayName}
            />
            <div className="min-w-0 flex-1">
                <Link
                    href={route('user.show', member.id)}
                    className="font-medium hover:underline"
                >
                    {displayName}
                </Link>
                <dl className="text-muted-foreground mt-1 flex flex-wrap gap-x-4 gap-y-0 text-sm">
                    <span>Создан: {formatDate(member.created_at)}</span>
                    <span>
                        В группе с: {formatDate(member.joined_group_at)}
                    </span>
                    <span>Побед: {wins}</span>
                </dl>
            </div>
            {editable && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shake-soft text-destructive hover:text-destructive"
                    onClick={() => onRemoveMember?.(member.id)}
                >
                    Удалить
                </Button>
            )}
        </div>
    );
}

export function GroupMembersList({
    members,
    editable,
    onRemoveMember,
}: GroupMembersListProps) {
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
                <MemberRow
                    key={member.id}
                    member={member}
                    editable={editable}
                    onRemoveMember={onRemoveMember}
                />
            ))}
        </div>
    );
}
