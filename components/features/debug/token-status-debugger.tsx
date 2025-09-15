"use client";

import { useAppStore } from "@/store/store";
import { useState, useRef, useCallback, useEffect } from "react";

/**
 * A simple, unstyled diagnostic component to display the current state
 * of the blockchain.token slice in real-time.
 */
export const TokenStatusDisplay = () => {
	// --- DRAG & DROP STATE ---
	const getInitialPosition = () => {
		if (typeof window !== "undefined") {
			return { x: window.innerWidth - 420, y: window.innerHeight * 0.25 };
		}
		return { x: 0, y: 100 };
	};
	const [position, setPosition] = useState(getInitialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const panelRef = useRef<HTMLDivElement>(null);

	// 1. Select all the state properties from our token slice.
	const { tokens, tokenFetchStatus } = useAppStore(
		(state) => state.blockchain.token
	);

	// We can also create simple "selectors" here to derive specific tokens for display.
	const nativeToken = tokens.find((t) => t.tags?.includes("native"));
	const usdxToken = tokens.find((t) => t.symbol === "USDX");

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
			const maxX = window.innerWidth - 400; // panel width
			const maxY =
				window.innerHeight - (panelRef.current?.offsetHeight || 500);

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

	return (
		<div
			ref={panelRef}
			style={{
				position: "fixed",
				bottom: "auto",
				right: "auto",
				left: position.x,
				top: position.y,
				backgroundColor: "rgba(0, 0, 0, 0.8)",
				color: "white",
				padding: "15px",
				borderRadius: "8px",
				border: "1px solid #555",
				fontFamily: "monospace",
				fontSize: "14px",
				zIndex: 9999,
				maxWidth: "400px",
				maxHeight: "40vh", // Make it scrollable if the token list is long
				overflowY: "auto",
				cursor: isDragging ? "grabbing" : "grab",
				userSelect: "none",
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
			<h3
				style={{
					margin: "0 0 10px 0",
					borderBottom: "1px solid #555",
					paddingBottom: "5px",
				}}
			>
				Token State (Live)
			</h3>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "120px 1fr",
					gap: "8px",
				}}
			>
				<span>Fetch Status:</span>
				<code
					style={{
						color:
							tokenFetchStatus === "success"
								? "#7f7"
								: tokenFetchStatus === "loading"
								? "#ff7"
								: "#f77",
					}}
				>
					{tokenFetchStatus.toUpperCase()}
				</code>

				<span>Token Count:</span>
				<code style={{ color: "#7f7" }}>{tokens.length}</code>

				<span
					style={{
						gridColumn: "1 / -1",
						marginTop: "10px",
						borderTop: "1px solid #444",
						paddingTop: "10px",
						fontWeight: "bold",
					}}
				>
					Key Tokens:
				</span>

				<span>Native Token:</span>
				<code style={{ color: "#7f7" }}>
					{nativeToken
						? `${
								nativeToken.symbol
						  } (${nativeToken.balance.substring(0, 6)})`
						: "Not Found"}
				</code>

				<span>USDX Token:</span>
				<code style={{ color: "#7f7" }}>
					{usdxToken
						? `${usdxToken.symbol} (${usdxToken.balance})`
						: "Not Found"}
				</code>

				<span
					style={{
						gridColumn: "1 / -1",
						marginTop: "10px",
						borderTop: "1px solid #444",
						paddingTop: "10px",
						fontWeight: "bold",
					}}
				>
					Full Token List:
				</span>

				<pre
					style={{
						margin: 0,
						gridColumn: "1 / -1",
						color: "#aaa",
						whiteSpace: "pre-wrap",
						wordBreak: "break-all",
						fontSize: "12px",
					}}
				>
					<code>
						{tokens.length > 0
							? JSON.stringify(tokens, null, 2)
							: "[]"}
					</code>
				</pre>
			</div>
		</div>
	);
};
