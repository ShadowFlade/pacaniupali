import {
    GameHistoryItemGame,
    GameHistoryItemGroup,
    GamesHistoryItem,
} from './GamesHistoryItem';

export type { GameHistoryItemGame, GameHistoryItemGroup };

type Group = {
    id: number | string;
    logo_path?: string | null;
    name?: string;
};

type GameWithGroupId = GameHistoryItemGame & { group_id?: number | string };

type GameHistoryProps = {
    games: GameWithGroupId[];
    /** Список групп для подстановки лого по game.group_id */
    groups?: Group[];
};

export function GamesHistory({ games, groups = [] }: GameHistoryProps) {
    const groupById = groups.reduce<Record<string, Group>>((acc, g) => {
        acc[String(g.id)] = g;
        return acc;
    }, {});

    return (
        <table className="w-full table-fixed border-collapse text-left">
            <thead>
                <tr className="border-b border-border text-muted-foreground">
                    <th className="w-[180px] py-2 pr-4 text-sm font-medium">
                        Дата
                    </th>
                    <th className="w-24 py-2 pr-4 text-sm font-medium">
                        Участников
                    </th>
                    <th className="py-2 pr-4 text-sm font-medium">
                        Участники
                    </th>
                    <th className="py-2 pr-4 text-sm font-medium">
                        Победитель
                    </th>
                    {/*<th className="w-12 py-2 text-right text-sm font-medium">*/}
                    {/*    Группа*/}
                    {/*</th>*/}
                </tr>
            </thead>
            <tbody>
                {games.map((game) => {
                    const group = game.group_id
                        ? groupById[String(game.group_id)]
                        : undefined;
                    return (
                        <GamesHistoryItem
                            key={String(game.id)}
                            game={game}
                            group={group ?? undefined}
                        />
                    );
                })}
            </tbody>
        </table>
    );
}
