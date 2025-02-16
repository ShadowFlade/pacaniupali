import { User } from '@/types';

type LastTeamGame = {
    id: number;
    winner: string;
    participants: User[];
    totalPoints: number;
}
type LastTeamGamesProps = LastTeamGame[];

export default function LastTeamGames(games: LastTeamGamesProps) {
    return (
        <>
        </>
    );
}
