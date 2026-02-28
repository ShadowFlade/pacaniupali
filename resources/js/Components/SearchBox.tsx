"use client"

import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "@/components/ui/combobox"
import {
    Item,
    ItemContent,
    ItemTitle,
} from "@/components/ui/item"

const countries = [
    { code: "", value: "", continent: "", label: "Select country" },
    {
        code: "ar",
        value: "argentina",
        label: "Argentina",
        continent: "South America",
    },
    { code: "au", value: "australia", label: "Australia", continent: "Oceania" },
    { code: "br", value: "brazil", label: "Brazil", continent: "South America" },
    { code: "ca", value: "canada", label: "Canada", continent: "North America" },
    { code: "cn", value: "china", label: "China", continent: "Asia" },
    {
        code: "co",
        value: "colombia",
        label: "Colombia",
        continent: "South America",
    },
    { code: "eg", value: "egypt", label: "Egypt", continent: "Africa" },
    { code: "fr", value: "france", label: "France", continent: "Europe" },
    { code: "de", value: "germany", label: "Germany", continent: "Europe" },
    { code: "it", value: "italy", label: "Italy", continent: "Europe" },
    { code: "jp", value: "japan", label: "Japan", continent: "Asia" },
    { code: "ke", value: "kenya", label: "Kenya", continent: "Africa" },
    { code: "mx", value: "mexico", label: "Mexico", continent: "North America" },
    {
        code: "nz",
        value: "new-zealand",
        label: "New Zealand",
        continent: "Oceania",
    },
    { code: "ng", value: "nigeria", label: "Nigeria", continent: "Africa" },
    {
        code: "za",
        value: "south-africa",
        label: "South Africa",
        continent: "Africa",
    },
    { code: "kr", value: "south-korea", label: "South Korea", continent: "Asia" },
    {
        code: "gb",
        value: "united-kingdom",
        label: "United Kingdom",
        continent: "Europe",
    },
    {
        code: "us",
        value: "united-states",
        label: "United States",
        continent: "North America",
    },
]

type UserItem = { id: number; username: string };

export function SearchUserPopup({
    users = [],
    onSearchChange,
}: {
    users?: UserItem[];
    onSearchChange?: (value: string) => void;
}) {
    const userList = Array.isArray(users) ? users : [];
    return (
        <div className="w-full min-w-[16rem]">
            <Combobox
                items={userList}
                itemToStringValue={(user: UserItem) => user.username}
            >
                <ComboboxInput
                    placeholder="Search users..."
                    className="w-full min-w-[16rem]"
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
                <ComboboxContent
                    align="center"
                    className="min-w-[16rem] w-full max-w-[min(var(--available-width),24rem)]"
                >
                    <ComboboxEmpty>No users found.</ComboboxEmpty>
                    <ComboboxList>
                        {(user) => (
                            <ComboboxItem key={user.id} value={user}>
                                <Item size="sm" className="p-0">
                                    <ItemContent>
                                        <ItemTitle className="whitespace-nowrap">
                                            {user.username}
                                        </ItemTitle>
                                    </ItemContent>
                                </Item>
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    )
}
