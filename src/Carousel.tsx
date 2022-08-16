import { useDrag } from "@use-gesture/react";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { motion, MotionValue, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import Clip from "./assets/clip.png";

const getImageUrl = (path: string) =>
	new URL(`./assets/${path}`, import.meta.url).href;

const photos = [
	"mountain.jpg",
	"sky.jpg",
	"water.jpg",
	"mountain.jpg",
	"sky.jpg",
	"water.jpg",
	"mountain.jpg",
	"sky.jpg",
	"water.jpg",
];
export default function Carousel() {
	const wheelGestures = WheelGesturesPlugin();
	const [emblaRef] = useEmblaCarousel(
		{
			skipSnaps: true,
			align: "start",
		},
		[wheelGestures]
	);

	const rotate = useMotionValue(0);
	const spring = useSpring(rotate, {
		stiffness: 150,
		damping: 2,
		mass: 2,
	});

	const bind = useDrag(({ delta: [dx], dragging }) => {
		spring.set(dx / 5);
		if (!dragging) {
			spring.set(0);
		}
	});

	return (
		<div
			ref={emblaRef}
			className="bg-teal-300 overflow-hidden pt-40 pl-gutter cursor-grab active:cursor-grabbing"
			{...bind()}
		>
			<div className="flex gap-gutter will-change-transform">
				{photos.map((photo, i) => (
					<Card rotate={spring} key={i} photo={getImageUrl(photo)} />
				))}
			</div>
		</div>
	);
}

function Card({ photo, rotate }: { photo: string; rotate: MotionValue }) {
	const offsetY = useRef<number>(Math.random() * 160);

	return (
		<motion.div
			style={{
				rotate: rotate,
			}}
			className="relative origin-top flex flex-col isolate items-center flex-shrink-0 w-80 gap-4 pb-64 max-w-[80vw] pt-48"
		>
			<div
				className="absolute w-1 top-0 -z-50 bg-gradient-string"
				style={{
					height: `${192 + offsetY.current}px`,
				}}
			/>
			<div
				className="relative flex flex-col items-center gap-4 border-8 border-white bg-white"
				style={{
					transform: `translateY(${offsetY.current}px)`,
				}}
			>
				<img
					className="absolute z-10 h-24 top-0 -translate-y-16"
					src={Clip}
					alt=""
				/>
				<div className="relative flex flex-col items-center h-full w-full">
					<div className="relative">
						<img
							className="h-full w-full max-h-[50vh] object-cover"
							src={photo}
							alt=""
						/>
					</div>
					<div className="text-center p-4 -z-50">
						<h3 className="text-2xl">John</h3>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
