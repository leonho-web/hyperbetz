import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/pro-light-svg-icons";
import { useTranslations } from "@/lib/locale-provider";

interface LoadMoreButtonProps {
	onClick: () => void;
	isVisible: boolean;
	isLoading?: boolean; // Optional loading state for when fetching more
}

export const LoadMoreButton = ({
	onClick,
	isVisible,
	isLoading,
}: LoadMoreButtonProps) => {
	const t = useTranslations("query");
	if (!isVisible) {
		return null;
	}

	return (
		<div className="flex justify-center py-6">
			<Button onClick={onClick} disabled={isLoading} className="w-fit">
				{isLoading && (
					<FontAwesomeIcon
						icon={faSpinner}
						className="mr-2 h-4 w-4 animate-spin"
					/>
				)}
				{t("loadMore")}
			</Button>
		</div>
	);
};
