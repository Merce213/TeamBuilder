import { useEffect, useRef, useState } from "react";

interface PopoverProps {
	children: React.ReactNode;
	content: React.ReactNode;
	position: "top" | "bottom";
	isClicked: boolean;
}

const Popover = ({
	children,
	content,
	position,
	isClicked,
}: PopoverProps): JSX.Element => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const popoverRef = useRef<HTMLDivElement | null>(null);
	const triggerRef = useRef<HTMLDivElement | null>(null);

	const positionClass =
		position === "bottom"
			? "top-full mt-2"
			: position === "top"
			? "bottom-full mb-2"
			: "";

	const toggleVisibility = () => {
		setIsVisible(!isVisible);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				popoverRef.current &&
				!popoverRef.current.contains(event.target as Node) &&
				!triggerRef.current?.contains(event.target as Node)
			) {
				setIsVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isClicked) {
			setIsVisible(false);
		}
	}, [isClicked]);

	return (
		<div
			className={`relative flex w-full ${
				position === "bottom" ? "border-b" : "border-t"
			} border-gray-light-3 border-solid p-2`}
		>
			<div
				ref={triggerRef}
				className="flex w-full items-center justify-between p-2 cursor-pointer hover:bg-gray-light-1 rounded-sm"
				onClick={toggleVisibility}
				aria-haspopup="true"
				aria-expanded={isVisible}
				aria-controls="popover-content"
			>
				{children}
			</div>
			{isVisible && (
				<div
					id="popover-content"
					ref={popoverRef}
					className={`w-full animate-fade-in duration-150 absolute left-1/2 -translate-x-1/2 bg-background shadow-xl rounded-lg border border-gray-light-3 ${positionClass}`}
					role="dialog"
					aria-modal="true"
				>
					{content}
				</div>
			)}
		</div>
	);
};

export default Popover;
