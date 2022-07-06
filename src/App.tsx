import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useElementSize } from "./hooks/useDivSize";

type XPos = "left" | "right";
type YPos = "top" | "bottom";

type Position = {
	x: XPos;
	y: YPos;
};

interface TileData {
	id: number;
	color: string;
	delay: number;
	expandDelay: number;
	x: XPos;
	y: YPos;
}

function Tile({
	containerWidth,
	color,
	isActive,
	onClick,
	delay,
}: {
	containerWidth: number;
	color: string;
	isActive: boolean;
	onClick: () => void;
	delay: number;
}) {
	return (
		<motion.div
			className={`flex h-full overflow-hidden pointer-events-none`}
			animate={{ width: isActive ? "100%" : "50%" }}
			transition={{ type: "spring", bounce: 0, delay, duration: 0.5 }}
			style={{ backgroundColor: color }}
		>
			<div
				className="shrink-0 pointer-events-auto"
				onClick={onClick}
				style={{ width: containerWidth / 2 }}
			>
				<h1 className="text-xl">Title</h1>
				<p>wow this kinda works</p>
			</div>
			<AnimatePresence exitBeforeEnter>
				{isActive && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						style={{ width: containerWidth / 2 }}
						className="shrink-0 pointer-events-auto"
					>
						<h1 className="text-xl">Content</h1>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
							aliquid commodi aperiam, minima non ratione ab a quod possimus
							amet placeat itaque quasi optio. Incidunt, minima delectus. Vitae,
							voluptates aperiam.
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

function App() {
	const gridRef = useRef<HTMLDivElement>(null);
	const containerSize = useElementSize(gridRef);

	const positionTable = {
		top: 0,
		bottom: containerSize.height / 2,
		left: 0,
		right: containerSize.width / 2,
	};

	const [activeTile, setActiveTile] = useState(0);

	const [tiles, setTiles] = useState<TileData[]>([
		{
			id: 0,
			color: "#84cc16",
			x: "left",
			y: "top",
			delay: 0,
			expandDelay: 0,
		},
		{
			id: 1,
			color: "#06b6d4",
			x: "left",
			y: "bottom",
			delay: 0,
			expandDelay: 0,
		},
		{
			id: 2,
			color: "#f59e0b",
			x: "right",
			y: "bottom",
			delay: 0,
			expandDelay: 0,
		},
	]);

	const computeAndAnimateNewTile = (
		tile: TileData,
		newActivePos: Position
	): TileData => {
		const currentPos = {
			x: tile.x,
			y: tile.y,
		};

		// if it's the one that's clicked, then it should move to the left
		if (currentPos.x === newActivePos.x && currentPos.y === newActivePos.y) {
			return {
				...tile,
				x: "left",
				y: currentPos.y,
				delay: newActivePos.x === "left" ? 1 : 1.5,
				expandDelay: newActivePos.x === "left" ? 1 : 1.5,
			};
		}
		// if the x is the same but y is different, then it doesnt need to move
		if (currentPos.x === newActivePos.x) {
			return { ...tile, delay: 0, expandDelay: 0 };
		}
		// if y is the same (and therefore x is different), then it needs to move y
		// if the new active tile is on the left, then the delay should be shorter
		if (currentPos.y === newActivePos.y) {
			const newY = currentPos.y === "bottom" ? "top" : "bottom";

			return {
				...tile,
				x: currentPos.x,
				y: newY,
				delay: newActivePos.x === "left" ? 0.5 : 1,
				expandDelay: 0,
			};
		}
		// if the x and y are different then it needs to move x
		if (currentPos.x !== newActivePos.x && currentPos.y !== newActivePos.y) {
			return {
				...tile,
				x: "right",
				y: currentPos.y,
				delay: 0.5,
				expandDelay: 0,
			};
		}

		console.error("this shouldn't happen.");
		return {
			...tile,
			x: currentPos.x,
			y: currentPos.y,
		};
	};

	const createOnClick = (tile: TileData) => {
		return () => {
			const clickedPos = {
				x: tile.x,
				y: tile.y,
			};
			// if it's already active, don't do anything
			if (clickedPos.y === tiles[activeTile].y) return;

			setActiveTile(tile.id);

			setTiles((tiles) =>
				tiles.map((tile) => computeAndAnimateNewTile(tile, clickedPos))
			);
		};
	};

	return (
		<main className="h-full grid place-items-center">
			<div className="w-full bg-gray-300 px-52 py-20">
				<div
					className="relative h-[800px] bg-teal-900"
					style={{ overflowAnchor: "none" }}
					ref={gridRef}
				>
					{tiles.map((tile) => (
						<motion.div
							className="absolute h-[400px] w-full pointer-events-none"
							animate={{ x: positionTable[tile.x], y: positionTable[tile.y] }}
							transition={{
								type: "spring",
								bounce: 0,
								duration: 0.5,
								delay: tile.delay,
							}}
						>
							<Tile
								key={tile.id}
								containerWidth={containerSize.width}
								delay={tile.expandDelay}
								color={tile.color}
								isActive={tile.id === activeTile}
								onClick={createOnClick(tile)}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}

export default App;
