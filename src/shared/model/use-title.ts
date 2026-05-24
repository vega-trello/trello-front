import { useEffect } from "react";

export function useTitle(part: string) {
	useEffect(() => {
		document.title = `Trega | ${part}`;
	}, [part]);
}
