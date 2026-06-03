import { useEffect } from "react";

export function useTitle(part: string) {
	useEffect(() => {
		document.title = `Vrello | ${part}`;
	}, [part]);
}
