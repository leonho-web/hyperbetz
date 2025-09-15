"use client";

import { useAppStore } from "@/store/store";
import {
	TransactionType,
	TransactionStatus,
	AppTransaction,
} from "@/types/blockchain/transactions.types";
import {
	selectPendingTransactionCount,
	selectMostRecentTransaction,
} from "@/store/selectors/blockchain/blockchain.selectors";
import { useState, useRef, useCallback, useEffect } from "react";

/**
 * A comprehensive, unstyled diagnostic component to test the full lifecycle
 * of the ENTIRE blockchain state management system.
 */
export const BlockchainControlPanel = () => {
	// --- DRAG & DROP STATE ---
	const getInitialPosition = () => {
		if (typeof window !== "undefined") {
			return { x: 10, y: 10 };
		}
		return { x: 0, y: 0 };
	};
	const [position, setPosition] = useState(getInitialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const panelRef = useRef<HTMLDivElement>(null);

	// --- STATE & SELECTORS ---
	const { network, chainId } = useAppStore(
		(state) => state.blockchain.network
	);
	const { tokens, tokenFetchStatus } = useAppStore(
		(state) => state.blockchain.token
	);
	const { transactions } = useAppStore(
		(state) => state.blockchain.transaction
	);
	const { connectionStatus } = useAppStore(
		(state) => state.blockchain.websocket
	);
	const pendingTxCount = useAppStore(selectPendingTransactionCount);
	const mostRecentTx = useAppStore(selectMostRecentTransaction);

	// --- ACTIONS ---
	const { addTransaction, processWebSocketUpdate } = useAppStore(
		(state) => state.blockchain.transaction
	);

	// --- DRAG HANDLERS ---
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			setIsDragging(true);
			setDragStart({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
			e.preventDefault();
		},
		[position]
	);

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			const newX = e.clientX - dragStart.x;
			const newY = e.clientY - dragStart.y;

			// Keep panel within viewport bounds
			const maxX = window.innerWidth - 450; // panel width
			const maxY =
				window.innerHeight - (panelRef.current?.offsetHeight || 600);

			setPosition({
				x: Math.max(0, Math.min(newX, maxX)),
				y: Math.max(0, Math.min(newY, maxY)),
			});
		},
		[isDragging, dragStart]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	// Add/remove global mouse event listeners
	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "grabbing";
			document.body.style.userSelect = "none";
		} else {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	// --- MOCK ACTION HANDLERS ---
	const handleAddDeposit = () => {
		const mockHash = `0x${[...Array(64)]
			.map(() => Math.floor(Math.random() * 16).toString(16))
			.join("")}`;
		addTransaction({
			hash: mockHash,
			type: TransactionType.DEPOSIT,
			amount: 100,
			tokenSymbol: "USDT",
			network: chainId || "Unknown",
		});
	};

	const handleAddSwap = () => {
		const mockHash = `0x${[...Array(64)]
			.map(() => Math.floor(Math.random() * 16).toString(16))
			.join("")}`;
		addTransaction({
			hash: mockHash,
			type: TransactionType.SWAP,
			amount: "0.5",
			tokenSymbol: "ETH",
			fromToken: "ETH",
			toToken: "USDC",
			network: "Arbitrum One",
		});
	};

	// --- WEBSOCKET SIMULATORS ---
	const simulateConfirmMostRecent = () => {
		if (mostRecentTx?.hash) {
			processWebSocketUpdate({
				txId: mostRecentTx.hash,
				amount: Number(mostRecentTx.amount),
				currency: mostRecentTx.tokenSymbol,
				status: "CONFIRMED",
			});
		}
	};

	return (
		<div
			ref={panelRef}
			style={{
				...panelStyle,
				position: "fixed",
				left: position.x,
				top: position.y,
				cursor: isDragging ? "grabbing" : "grab",
			}}
			onMouseDown={handleMouseDown}
		>
			{/* Drag handle indicator */}
			<div
				style={{
					position: "absolute",
					top: 5,
					right: 5,
					width: 20,
					height: 20,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					fontSize: "12px",
					color: "#888",
					cursor: "grab",
				}}
			>
				⋮⋮
			</div>

			{/* --- Section 1: LIVE STATUS --- */}
			<Section title="Live Status">
				<StatusItem
					label="Network"
					value={network?.name || "null"}
					color={network ? "#7af" : "#aaa"}
				/>
				<StatusItem
					label="Chain ID"
					value={String(chainId)}
					color={chainId ? "#7af" : "#aaa"}
				/>
				<StatusItem
					label="Token Status"
					value={tokenFetchStatus}
					color={tokenFetchStatus === "success" ? "#7f7" : "#ff7"}
				/>
				<StatusItem
					label="Token Count"
					value={String(tokens.length)}
					color={tokens.length > 0 ? "#7f7" : "#aaa"}
				/>
				<StatusItem
					label="WS Status"
					value={connectionStatus}
					color={connectionStatus === "connected" ? "#7f7" : "#ff7"}
				/>
				<StatusItem
					label="Pending Txs"
					value={String(pendingTxCount)}
					color={pendingTxCount > 0 ? "#ff7" : "#7f7"}
				/>
			</Section>

			{/* --- Section 2: ACTIONS --- */}
			<Section title="Actions">
				<div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
					<button onClick={handleAddDeposit} style={buttonStyle}>
						Add Mock Deposit
					</button>
					<button onClick={handleAddSwap} style={buttonStyle}>
						Add Mock Swap
					</button>
					<button
						onClick={simulateConfirmMostRecent}
						style={{ ...buttonStyle, backgroundColor: "#282" }}
					>
						Confirm Latest Tx
					</button>
				</div>
			</Section>

			{/* --- Section 3: TRANSACTIONS LIST --- */}
			<Section title={`Transaction Log (${transactions.length})`}>
				<div
					style={{
						maxHeight: "200px",
						overflowY: "auto",
						border: "1px solid #444",
						padding: "5px",
						borderRadius: "4px",
						backgroundColor: "#111",
					}}
				>
					{transactions.length > 0 ? (
						transactions.map((tx) => (
							<TransactionItem key={tx.id} tx={tx} />
						))
					) : (
						<p style={{ color: "#888", margin: 0 }}>
							No transactions in state.
						</p>
					)}
				</div>
			</Section>
		</div>
	);
};

// --- HELPER COMPONENTS AND STYLES (Now included) ---

const Section = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<div
		style={{
			borderBottom: "1px solid #555",
			paddingBottom: "10px",
			marginBottom: "10px",
		}}
	>
		<h3
			style={{
				margin: 0,
				marginBottom: "10px",
				fontSize: "16px",
				color: "#eee",
			}}
		>
			{title}
		</h3>
		{children}
	</div>
);

const StatusItem = ({
	label,
	value,
	color,
}: {
	label: string;
	value: string;
	color?: string;
}) => (
	<div
		style={{
			display: "flex",
			justifyContent: "space-between",
			fontSize: "12px",
			marginBottom: "4px",
		}}
	>
		<span style={{ color: "#aaa" }}>{label}:</span>
		<code style={{ color: color || "#fff" }}>{value}</code>
	</div>
);

const TransactionItem = ({ tx }: { tx: AppTransaction }) => {
	const getStatusColor = (status: TransactionStatus) => {
		if (status === TransactionStatus.CONFIRMED) return "#7f7"; // green
		if (status === TransactionStatus.PENDING) return "#ff7"; // yellow
		if (status === TransactionStatus.FAILED) return "#f77"; // red
		return "#fff";
	};
	return (
		<div
			style={{
				border: "1px solid #444",
				borderRadius: "4px",
				padding: "8px",
				marginBottom: "8px",
				fontSize: "12px",
			}}
		>
			<p>
				<strong>ID:</strong> {tx.id} | <strong>Type:</strong>{" "}
				{tx.type.toUpperCase()}
			</p>
			<p>
				<strong>Status:</strong>{" "}
				<code
					style={{
						color: getStatusColor(tx.status),
						fontWeight: "bold",
					}}
				>
					{tx.status.toUpperCase()}
				</code>
			</p>
			<p>
				<strong>Amount:</strong> {tx.amount} {tx.tokenSymbol}
			</p>
			<p>
				<strong>Hash:</strong> {tx.hash?.substring(0, 12)}...
			</p>
			{tx.error && (
				<p>
					<strong>Error:</strong>{" "}
					<code style={{ color: "#f77" }}>{tx.error}</code>
				</p>
			)}
			{tx.timeoutId && (
				<p style={{ color: "#7af" }}>Failsafe Timer is active...</p>
			)}
		</div>
	);
};

const panelStyle: React.CSSProperties = {
	backgroundColor: "rgba(20, 0, 20, 0.9)",
	color: "white",
	padding: "15px",
	borderRadius: "8px",
	border: "1px solid #777",
	fontFamily: "monospace",
	fontSize: "14px",
	zIndex: 9998,
	width: "450px",
	maxHeight: "95vh",
	display: "flex",
	flexDirection: "column",
	backdropFilter: "blur(5px)",
	userSelect: "none",
};

const buttonStyle: React.CSSProperties = {
	backgroundColor: "#333",
	color: "white",
	border: "1px solid #555",
	padding: "5px 10px",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "12px",
};
