import { useCallback, useState } from "react";
import { HeadingContext } from "./context";

export function HeadingProvider({ children }: { children: React.ReactNode }) {
	const [heading, setHeading] = useState<React.ReactNode | null>(null);

	const handleSetHeading = useCallback((title: React.ReactNode) => {
		setHeading(title);
	}, []);

	return (
		<HeadingContext.Provider value={{ heading, setHeading: handleSetHeading }}>
			{children}
		</HeadingContext.Provider>
	);
}
