import { useMove } from "@use-gesture/react";
import { useEffect, useRef, useState } from "react";
import Leaves from "../assets/leaves.jpg";

export default function Lamp() {
	const [rotation, setRotation] = useState(0);
	const [lampPath, setLampPath] = useState("");
	const [headPos, setHeadPos] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const lampRef = useRef<SVGSVGElement>(null);
	const leafRef = useRef<SVGSVGElement>(null);

	const bind = useMove((state) => {
		if (lampRef.current === null) return;

		const {
			xy: [x, y],
		} = state;

		const isRight = x > headPos.x;

		const rotate =
			Math.atan((headPos.y - y) / (headPos.x - x)) + (isRight ? Math.PI : 0);

		setRotation(rotate);
	});

	useEffect(() => {
		const resizeHandler = () => {
			if (containerRef.current === null || lampRef.current === null) return;

			const { width, height, bottom } =
				containerRef.current.getBoundingClientRect();

			const {
				left,
				width: lampWidth,
				top,
				height: lampHeight,
			} = lampRef.current.getBoundingClientRect();

			const headX = left + lampWidth * 0.63;
			const headY = top + lampHeight * 0.12;

			setHeadPos({
				x: headX,
				y: headY,
			});

			const distanceBetweenLampHeadAndBLCorner = Math.sqrt(
				headX ** 2 + (bottom - headY) ** 2
			);

			const rayX = headX - distanceBetweenLampHeadAndBLCorner;
			const angle = 15 * (Math.PI / 180);
			const yOffset = Math.tan(angle) * distanceBetweenLampHeadAndBLCorner;
			const y1 = headY + yOffset;
			const y2 = headY - yOffset;

			setLampPath(
				`\
				M ${headX} ${headY}\
				L ${rayX} ${y1}\
				L ${rayX} ${y2}\
				Z`
			);

			leafRef.current?.setAttribute("viewBox", `0 0 ${width} ${height}`);
		};

		window.addEventListener("resize", resizeHandler);

		resizeHandler();

		return () => window.removeEventListener("resize", resizeHandler);
	}, []);

	return (
		<div
			className="grid place-items-center relative h-screen bg-red-500 isolate overflow-hidden"
			{...bind()}
			ref={containerRef}
		>
			<svg
				viewBox="0 0 1920 1080"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				className="absolute -z-10 top-0 left-0 h-full w-full overflow-visible"
				preserveAspectRatio="none"
				ref={leafRef}
			>
				<mask
					id="leafMask"
					style={{ maskType: "alpha" }}
					maskUnits="userSpaceOnUse"
					width="1920"
					height="1080"
				>
					<path
						style={{
							transform: `rotate(${rotation}rad)`,
							transformOrigin: "53% 29.5%",
						}}
						d={lampPath}
						fill="#fff"
					/>
				</mask>
				<image
					mask="url(#leafMask)"
					patternContentUnits="objectBoundingBox"
					width="1920"
					height="1080"
					xlinkHref={Leaves}
				/>
			</svg>
			<svg
				width="229"
				height="481"
				viewBox="0 0 229 481"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="overflow-visible"
				ref={lampRef}
			>
				<ellipse cx="101.5" cy="446.5" rx="101.5" ry="34.5" fill="#606060" />
				<path
					d="M202.5 446.5C202.5 451.049 199.788 455.458 194.71 459.539C189.636 463.616 182.264 467.31 173.11 470.422C154.806 476.643 129.488 480.5 101.5 480.5C73.5107 480.5 48.1926 476.643 29.8891 470.422C20.7349 467.31 13.3627 463.616 8.28909 459.539C3.21094 455.458 0.499512 451.049 0.499512 446.5C0.499512 441.951 3.21094 437.542 8.28909 433.461C13.3627 429.384 20.7349 425.69 29.8891 422.578C48.1926 416.357 73.5107 412.5 101.5 412.5C129.488 412.5 154.806 416.357 173.11 422.578C182.264 425.69 189.636 429.384 194.71 433.461C199.788 437.542 202.5 441.951 202.5 446.5Z"
					stroke="#43357C"
					stroke-opacity="0.49"
				/>
				<path
					d="M202 170L120 435.5C124.4 444.3 134.5 441.833 139 439.5L218 170C224 148.8 209.833 124.167 202 114.5L166 70L158.5 84L195 132C203.5 142 207.5 155 202 170Z"
					fill="#919191"
					stroke="#43357C"
					stroke-opacity="0.49"
				/>
				<g
					style={{
						transform: `rotate(${rotation}rad)`,
						transformOrigin: "63% 18%",
					}}
				>
					<path
						d="M225.451 67C195.051 49 158.117 46.1666 143.451 47C114.651 12.2 47.8332 1.66666 22.9999 1.5C31.0089 15.2717 36.1203 30.2576 39.0969 45.5C43.0262 65.6212 42.8049 100.189 41.0488 119C38.6872 144.297 33.2017 152.417 27.9999 166C77.9999 160.4 131.117 133.833 146.451 120.5C164.851 128.9 206.784 109.333 225.451 98.5C230.651 91.3 227.617 74.5 225.451 67Z"
						fill="#D9D9D9"
					/>
					<path
						d="M22.9999 1.5C9.16653 32.3333 -9.20016 108.4 27.9999 166C33.2017 152.417 38.6872 144.297 41.0488 119C11.5 89.5 33.384 59.3333 39.0969 45.5C36.1203 30.2576 31.0089 15.2717 22.9999 1.5Z"
						fill="#FCFCFC"
					/>
					<path
						d="M41.0488 119C42.8049 100.189 43.0262 65.6212 39.0969 45.5C33.384 59.3333 11.5 89.5 41.0488 119Z"
						fill="#FDFFB3"
					/>
					<path
						d="M27.9999 166C77.9999 160.4 131.117 133.833 146.451 120.5C164.851 128.9 206.784 109.333 225.451 98.5C230.651 91.3 227.617 74.5 225.451 67C195.051 49 158.117 46.1666 143.451 47C114.651 12.2 47.8332 1.66666 22.9999 1.5M27.9999 166C-9.20016 108.4 9.16653 32.3333 22.9999 1.5M27.9999 166C33.2017 152.417 38.6872 144.297 41.0488 119M22.9999 1.5C31.0089 15.2717 36.1203 30.2576 39.0969 45.5M39.0969 45.5C43.0262 65.6212 42.8049 100.189 41.0488 119M39.0969 45.5C33.384 59.3333 11.5 89.5 41.0488 119"
						stroke="#474969"
					/>
				</g>
			</svg>
		</div>
	);
}
