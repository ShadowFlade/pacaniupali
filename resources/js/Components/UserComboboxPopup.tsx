'use client';

import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from '@/components/ui/combobox';
import { fetchUsersSearch, type UserSearchItem } from '@/utility/requests';
import { usePage } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PageProps } from '@/types';

const PAGE_SIZE = 20;

type UserComboboxPopupProps = {
    container?: React.ComponentProps<typeof import('@/components/ui/combobox').ComboboxContent>['container'];
    placeholder?: string;
    /** When inside a dialog, pass the dialog content ref so the dropdown renders inside it. */
};

export function UserComboboxPopup({ container, placeholder = 'Search users…' }: UserComboboxPopupProps = {}) {
    const { props } = usePage<PageProps>();
    const [users, setUsers] = useState<UserSearchItem[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadMoreTriggered = useRef(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const csrf = (props as { csrf?: string }).csrf ?? '';

    const loadPage = useCallback(
        async (text: string, offset: number, append: boolean) => {
            if (!csrf) return;
            const setBusy = append ? setLoadingMore : setLoading;
            setBusy(true);
            try {
                const next = await fetchUsersSearch(
                    { csrf },
                    { text, limit: PAGE_SIZE, offset }
                );
                if (append) {
                    setUsers((prev) => (offset === 0 ? next : [...prev, ...next]));
                } else {
                    setUsers(next);
                }
                setHasMore(next.length >= PAGE_SIZE);
            } catch {
                setHasMore(false);
            } finally {
                setBusy(false);
                loadMoreTriggered.current = false;
            }
        },
        [csrf]
    );

    // When popup opens, load first page with current query
    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (open) loadPage(query, 0, false);
        },
        [query, loadPage]
    );

    // Load more when scrolling near bottom
    const handleListScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const el = e.currentTarget;
            const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
            if (!nearBottom || loadingMore || !hasMore || loadMoreTriggered.current) return;
            loadMoreTriggered.current = true;
            loadPage(query, users.length, true);
        },
        [query, users.length, loadingMore, hasMore, loadPage]
    );

    // Debounced search: when query changes (user typed), refetch from offset 0 after 300ms. Skip when query is empty (initial load happens on open).
    useEffect(() => {
        if (query === '') return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            debounceRef.current = null;
            loadPage(query, 0, false);
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, loadPage]);

    return (
        <Combobox
            items={users}
            itemToStringValue={(user: UserSearchItem) => user.username}
            onOpenChange={handleOpenChange}
            onInputValueChange={setQuery}
        >
            <ComboboxTrigger
                render={
                    <Button
                        variant="outline"
                        className="w-64 justify-between font-normal"
                    >
                        <ComboboxValue placeholder={placeholder} />
                    </Button>
                }
            />
            <ComboboxContent container={container}>
                <ComboboxInput showTrigger={false} placeholder={placeholder} />
                <ComboboxEmpty>
                    {loading ? 'Loading…' : 'No users found.'}
                </ComboboxEmpty>
                <ComboboxList
                    onScroll={handleListScroll}
                    className="max-h-64 overflow-y-auto"
                >
                    {(user: UserSearchItem) => (
                        <ComboboxItem key={user.id} value={user}>
                            {user.username}
                        </ComboboxItem>
                    )}
                </ComboboxList>
                {loadingMore && (
                    <div className="border-t px-2 py-1.5 text-center text-xs text-muted-foreground">
                        Loading more…
                    </div>
                )}
            </ComboboxContent>
        </Combobox>
    );
}
