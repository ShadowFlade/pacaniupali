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
