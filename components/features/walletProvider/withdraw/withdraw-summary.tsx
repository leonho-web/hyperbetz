"use client";

import { useTranslations } from "@/lib/locale-provider";

interface WithdrawSummaryProps {
  // fee: number;
  totalPayout: number;
  tokenSymbol?: string;
}

export const WithdrawSummary = ({
  // fee,
  totalPayout,
  tokenSymbol,
}: WithdrawSummaryProps) => {
  const t = useTranslations("walletProvider.withdrawSummary");
  return (
    <div className="space-y-2 rounded-md border bg-muted/50 p-4 text-sm">
      {/* <div className="flex justify-between">
				<span className="text-muted-foreground">Withdrawal Fee (1%)</span>
				<span>
					{fee.toFixed(4)} {tokenSymbol}
				</span>
			</div> */}
      <div className="flex justify-between font-semibold">
        <span className="text-muted-foreground">{t("youWillReceive")}</span>
        <span>
          {totalPayout.toFixed(4)} {tokenSymbol}
        </span>
      </div>
    </div>
  );
};
