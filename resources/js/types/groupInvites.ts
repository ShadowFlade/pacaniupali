/** Входящее приглашение (пользователь = приглашённый). */
export type GroupInviteRow = {
    id: number;
    user_id: number;
    group_id: number;
    key: string;
    created_at?: string;
    updated_at?: string;
    inviter_user_id?: number | null;
    inviter?: {
        id: number;
        username?: string;
        login?: string;
    };
    expires_at?: string | null;
    max_successful_attempts?: number | null;
    current_successful_attempts?: number | null;
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
