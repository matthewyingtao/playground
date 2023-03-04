import { useEffect, useRef } from "react";

export default function Shiny() {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({
				video: true,
			})
			.then((stream) => {
				if (videoRef.current === null) return;
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			})
			.catch((err) => {});
	}, []);

	return (
		<div className="h-full grid items-center">
			<button className="relative isolate bg-gray-500 border overflow-hidden border-black rounded-full py-4 px-12 text-2xl w-fit mx-auto">
				<span className="text-white opacity-70">Hello!</span>
				<video
					className="absolute -z-10 blur-lg inset-0 h-full w-full object-cover opacity-50 saturate-200 contrast-200"
					ref={videoRef}
				></video>
			</button>
		</div>
	);
}
