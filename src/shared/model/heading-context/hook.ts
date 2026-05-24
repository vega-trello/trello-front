import React, { useContext, useEffect } from "react";
import { HeadingContext } from "./context";

export const useHeading = () => {
	const context = useContext(HeadingContext);
	if (!context) {
		throw new Error("useHeading must be used within a HeadingProvider");
	}
	return context.heading;
};

export const useSetHeading = (heading: React.ReactNode) => {
	const context = useContext(HeadingContext);
	if (!context) {
		throw new Error("useHeading must be used within a HeadingProvider");
	}

	useEffect(() => {
		context.setHeading(heading);
	}, [context, heading]);
};
