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
	useEffect(() => {
		if (ref.current) {
			const { width, height } = ref.current.getBoundingClientRect();
			setSize({ width, height });
		}
	}, [ref]);
	return size;
};
