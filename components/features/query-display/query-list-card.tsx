"use client";

import { Game } from "@/types/games/gameList.types";
import { useDynamicAuth } from "@/hooks/useDynamicAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Play } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/pro-light-svg-icons";

export const QueryListCard = ({ game }: { game: Game }) => {
	const router = useRouter();
	const { isLoggedIn, login } = useDynamicAuth();

	const queryParams = new URLSearchParams({
		/* ... */
	}).toString();
	const gameUrl = `/play/${game.game_id}?${queryParams}`;

	const handlePlayClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation(); // Prevent navigation if the whole card is a link
		if (isLoggedIn) {
			router.push(gameUrl);
		} else {
			login();
		}
	};

	return (
		<div
			onClick={handlePlayClick}
			className="flex gap-4 cursor-pointer p-3 border rounded-lg bg-card items-center w-full transition-all hover:border-primary/50 hover:bg-muted"
		>
			<div className="relative w-20 h-20 bg-muted rounded-md flex-shrink-0 overflow-hidden">
				<Image
					src={game.full_url_game_image || ""}
					alt={game.game_name}
					fill
					className="object-cover"
				/>
			</div>
			<div className="flex-grow">
				<h3 className="font-semibold">{game.game_name}</h3>
				<p className="text-sm text-muted-foreground">
					{game.provider_name}
				</p>
			</div>
			<Button
				onClick={handlePlayClick}
				size="icon"
				className="flex-shrink-0"
			>
				<FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
			</Button>
		</div>
	);
};
