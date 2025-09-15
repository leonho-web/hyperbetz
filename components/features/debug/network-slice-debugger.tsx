"use client";

import { useAppStore } from "@/store/store";
import Image from "next/image";
import { useState, useRef, useCallback, useEffect } from "react";

/**
 * A simple, unstyled diagnostic component to display the current state
 * of the blockchain.network slice in real-time.
 */
export const NetworkStatusDisplay = () => {
	// --- DRAG & DROP STATE ---
	const getInitialPosition = () => {
		if (typeof window !== "undefined") {
			return { x: window.innerWidth - 420, y: 10 };
		}
		return { x: 0, y: 10 };
	};
	const [position, setPosition] = useState(getInitialPosition);
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const panelRef = useRef<HTMLDivElement>(null);

	// 1. Select all the state properties from our network slice.
	const { network, chainId, chainLogo } = useAppStore(
		(state) => state.blockchain.network
	);

	// A simple helper to format the output for better readability
	const formatObject = (obj: unknown) => {
		return obj ? JSON.stringify(obj, null, 2) : "null";
	};

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
				window.innerHeight - (panelRef.current?.offsetHeight || 300);

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
				Network State (Live)
			</h3>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "100px 1fr",
					gap: "5px",
				}}
			>
				<span>Chain ID:</span>
				<code style={{ color: "#7f7" }}>{chainId ?? "null"}</code>

				<span>Chain Logo:</span>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "10px",
					}}
				>
					{chainLogo && (
						<Image
							src={chainLogo}
							alt="chain logo"
							width={20}
							height={20}
						/>
					)}
					<code style={{ color: "#7f7", wordBreak: "break-all" }}>
						{chainLogo ?? "null"}
					</code>
				</div>

				<span>Network Obj:</span>
				<pre
					style={{
						margin: 0,
						color: "#7f7",
						whiteSpace: "pre-wrap",
						wordBreak: "break-all",
					}}
				>
					<code>{formatObject(network)}</code>
				</pre>
			</div>
		</div>
	);
};
