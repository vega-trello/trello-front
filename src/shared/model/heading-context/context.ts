import React, { createContext } from "react";

interface HeadingContextValue {
	heading: React.ReactNode;
	setHeading: (title: React.ReactNode) => void;
}

export const HeadingContext = createContext<HeadingContextValue | undefined>(
	undefined,
);
