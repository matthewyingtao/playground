import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import mountain from "./assets/mountain.jpg";
import sky from "./assets/sky.jpg";
import water from "./assets/water.jpg";
import { useElementSize } from "./hooks/useDivSize";

type XPos = "left" | "right";
type YPos = "top" | "bottom";

type Position = {
	x: XPos;
	y: YPos;
};

interface TileData {
	id: number;
	image: string;
	delay: number;
	expandDelay: number;
	x: XPos;
	y: YPos;
	title: string;
	subtitle: string;
}

const ANIM_DURATION = 0.5; // seconds
const DELAY_DURATION = 0.35; // seconds
const BLOCK_HEIGHT = 400; // px
const GAP = 20; // px

function Tile({
	containerWidth,
	image,
	isActive,
	onClick,
	delay,
	title,
	subtitle,
}: {
	containerWidth: number;
	image: string;
	isActive: boolean;
	onClick: () => void;
	delay: number;
	title: string;
	subtitle: string;
}) {
	return (
		<motion.div
			className={`flex h-full overflow-hidden pointer-events-none rounded-lg bg-center`}
			animate={{
				width: isActive ? containerWidth : containerWidth / 2 - GAP / 2,
			}}
			transition={{
				type: "spring",
				bounce: 0,
				delay,
				duration: ANIM_DURATION,
			}}
			style={{ backgroundImage: `url(${image})` }}
		>
			<div
				className="shrink-0 pointer-events-auto flex flex-col justify-center p-4"
				onClick={onClick}
				style={{ width: containerWidth / 2 }}
			>
				<div className="max-w-[45ch] mx-auto text-center">
					<h1
						className="text-7xl font-black text-blue-600"
						style={{
							textShadow: "0 0 10px #77a8eb73",
						}}
					>
						{title}
					</h1>
					<p className="text-3xl text-blue-900">{subtitle}</p>
				</div>
			</div>
			<AnimatePresence exitBeforeEnter>
				{isActive && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						style={{
							width: containerWidth / 2,
							background:
								"linear-gradient(to left, rgba(220,240,255,0.75), rgba(220,240,255,0))",
						}}
						className="shrink-0 pointer-events-auto flex flex-col justify-center"
					>
						<div className="text-lg text-gray-900 leading-relaxed p-4 max-w-[45ch] mx-auto">
							<p>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
								aliquid commodi aperiam, minima non ratione ab a quod possimus
								amet placeat itaque quasi optio. Incidunt, minima delectus.
								Vitae, voluptates aperiam.
							</p>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
								aliquid commodi aperiam, minima non ratione ab a quod possimus
								amet placeat itaque quasi optio.
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}

function App() {
	const gridRef = useRef<HTMLDivElement>(null);
	const containerSize = useElementSize(gridRef);

	const positionTable = useMemo(
		() => ({
			top: 0,
			bottom: BLOCK_HEIGHT + GAP,
			left: 0,
			right: containerSize.width / 2 + GAP / 2,
		}),
		[containerSize.width]
	);

	const [activeTile, setActiveTile] = useState(0);

	const [tiles, setTiles] = useState<TileData[]>([
		{
			id: 0,
			image: water,
			x: "left",
			y: "top",
			delay: 0,
			expandDelay: 0,
			title: "Water",
			subtitle: "Crisp, refreshing water.",
		},
		{
			id: 1,
			image: sky,
			x: "left",
			y: "bottom",
			delay: 0,
			expandDelay: 0,
			title: "Sky",
			subtitle: "Cradle of the sun.",
		},
		{
			id: 2,
			image: mountain,
			x: "right",
			y: "bottom",
			delay: 0,
			expandDelay: 0,
			title: "Mountain",
			subtitle: "Beautiful, towering peaks.",
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
				delay:
					newActivePos.x === "left" ? DELAY_DURATION * 2 : DELAY_DURATION * 3,
				expandDelay:
					newActivePos.x === "left" ? DELAY_DURATION * 2 : DELAY_DURATION * 3,
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
				delay: newActivePos.x === "left" ? DELAY_DURATION : DELAY_DURATION * 2,
				expandDelay: 0,
			};
		}
		// if the x and y are different then it needs to move x
		if (currentPos.x !== newActivePos.x && currentPos.y !== newActivePos.y) {
			return {
				...tile,
				x: "right",
				y: currentPos.y,
				delay: DELAY_DURATION,
				expandDelay: 0,
			};
		}

		console.error("this shouldn't happen.");
		return tile;
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
			<div className="w-full bg-gray-900 px-52 py-20">
				<div
					className="relative"
					style={{
						overflowAnchor: "none",
						height: `${2 * BLOCK_HEIGHT + GAP}px`,
					}}
					ref={gridRef}
				>
					{tiles.map((tile) => (
						<motion.div
							className="absolute h-[400px] w-full pointer-events-none"
							animate={{ x: positionTable[tile.x], y: positionTable[tile.y] }}
							transition={{
								type: "spring",
								bounce: 0,
								duration: ANIM_DURATION,
								delay: tile.delay,
							}}
						>
							<Tile
								key={tile.id}
								containerWidth={containerSize.width}
								delay={tile.expandDelay}
								image={tile.image}
								isActive={tile.id === activeTile}
								onClick={createOnClick(tile)}
								title={tile.title}
								subtitle={tile.subtitle}
							/>
						</motion.div>
					))}
				</div>
			</div>
		</main>
	);
}

export default App;
