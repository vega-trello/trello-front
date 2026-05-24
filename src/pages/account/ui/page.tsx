import { useEffect } from "react";

export function Page() {
	useEffect(() => {
		document.title = `Trega | Настройки`;
	});
	return <>Preferences</>;
}
