import React from "react";

const CoreContainer = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div className={["p-4 s-sm:ml-64 mt-16", className].join(" ")}>
			{children}
		</div>
	);
};

export default CoreContainer;
