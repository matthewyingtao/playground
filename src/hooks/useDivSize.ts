import { throttle } from "lodash";
import { useEffect, useState } from "react";

interface ElementSize {
	width: number;
	height: number;
}

export const useElementSize = (
	ref: React.RefObject<HTMLElement>
): ElementSize => {
	const [size, setSize] = useState<ElementSize>({
		width: 0,
		height: 0,
	});

	const updateSize = () => {
		const { width, height } = ref?.current?.getBoundingClientRect() || {
			width: 0,
			height: 0,
		};
		setSize({ width, height });
	};
	useEffect(() => {
		updateSize();
		const handleResize = throttle(updateSize, 100);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [ref]);
	return size;
};
