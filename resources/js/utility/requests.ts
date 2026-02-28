export async function sPost(url: string, data, props): Promise<Response> {
    return fetch(route('user.searchByUserName'), {
        method: 'POST',
        headers: {
            //@ts-ignore
            'X-CSRF-TOKEN': props.csrf,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export type FetchUsersOptions = {
    text?: string;
    limit?: number;
    offset?: number;
};

export type UserSearchItem = { id: number; username: string };

export async function fetchUsersSearch(
    props: { csrf: string },
    options: FetchUsersOptions = {}
): Promise<UserSearchItem[]> {
    const { text = '', limit = 20, offset = 0 } = options;
    const res = await sPost(route('user.searchByUserName'), { text, limit, offset }, props);
    if (!res.ok) return [];
    return res.json();
}
