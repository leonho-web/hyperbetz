import { Game } from "@/types/games/gameList.types";
import { ViewMode } from "./grid-list-toggle";
import { GameCard } from "../games/game-carousel-card"; // Your primary game card
import { Skeleton } from "@/components/ui/skeleton";
import { QueryListCard } from "./query-list-card";
import { nanoid } from "nanoid";
import { useTranslations } from "@/lib/locale-provider";
interface QueryResultsGridProps {
  games: Game[];
  viewMode: ViewMode;
  isLoading: boolean;
  itemsPerPage: number;
}

export const QueryResultsGrid = ({
  games,
  viewMode,
  isLoading,
  itemsPerPage,
}: QueryResultsGridProps) => {
  const tGames = useTranslations("games");
  if (isLoading) {
    return (
      <div
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {[...Array(itemsPerPage)].map((_, i) =>
          viewMode === "grid" ? (
            <Skeleton key={i} className="w-full aspect-[4.5/5] rounded-xl" />
          ) : (
            <Skeleton key={i} className="w-full h-28 rounded-lg" />
          )
        )}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-10">
        {tGames("noResults")}
      </p>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="grid grid-cols-1 gap-4">
        {games.map((game) => (
          <QueryListCard
            key={game.game_id + game.game_name + nanoid()}
            game={game}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-4">
      {games.map((game) => (
        <GameCard
          key={game.game_id + game.game_name + nanoid()}
          game={game}
          showCategory
          showProvider
        />
      ))}
    </div>
  );
};
