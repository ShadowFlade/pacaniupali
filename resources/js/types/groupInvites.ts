/** Входящее приглашение (пользователь = приглашённый). */
export type GroupInviteRow = {
    id: number;
    user_id: number;
    group_id: number;
    key: string;
    created_at?: string;
    updated_at?: string;
    /** Кто создал приглашение (после миграции / с бэкенда). */
    invited_by_user_id?: number | null;
    inviter?: {
        id: number;
        username?: string;
        login?: string;
    };
    expires_at?: string | null;
    max_uses?: number | null;
    uses_count?: number | null;
    group?: {
        id: number;
        name: string;
        code?: string;
    };
};

/** Исходящие приглашения группы (вкладка настроек на странице группы). */
export type GroupOutgoingInviteRow = GroupInviteRow & {
    invitee?: {
        id: number;
        username?: string;
        login?: string;
    };
};
