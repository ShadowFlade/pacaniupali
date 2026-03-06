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
        <ul className="flex flex-col gap-3">
            {games.map((game) => {
                const group = game.group_id
                    ? groupById[String(game.group_id)]
                    : undefined;
                return (
                    <li key={String(game.id)}>
                        <GamesHistoryItem
                            game={game}
                            group={group ?? undefined}
                        />
                    </li>
                );
            })}
        </ul>
    );
}
