import { X } from "lucide-react";
import React, { useEffect, useRef } from "react";

interface ModalProps {
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	closeOnClickOutside: boolean;
}

const Backdrop = ({ isOpen }: { isOpen: boolean; onClose: () => void }) => {
	return (
		isOpen && (
			<div className="fixed inset-0 bg-gray-light-2 opacity-20 z-40"></div>
		)
	);
};

const Overlay = ({
	isOpen,
	children,
}: {
	isOpen: boolean;
	children: React.ReactNode;
}) => {
	const overlayRef = useRef<HTMLDivElement | null>(null);

	return (
		isOpen && (
			<div
				ref={overlayRef}
				className="fixed z-40 inset-0 flex items-center justify-center backdrop-blur-sm"
			>
				{children}
			</div>
		)
	);
};

const Modal = ({
	isOpen,
	onClose,
	children,
	closeOnClickOutside,
}: ModalProps) => {
	const modalRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!closeOnClickOutside) return;
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const closeModal = () => {
		onClose();
	};

	return (
		<>
			<Backdrop isOpen={isOpen} onClose={closeModal} />
			<Overlay isOpen={isOpen}>
				<div
					className="bg-gray-light-1 rounded-lg p-4 w-full max-w-md mx-2 relative"
					ref={modalRef}
				>
					<button
						type="button"
						className="absolute top-4 right-4 rounded-lg btn-accent-outline text-primary-light-8"
						onClick={onClose}
					>
						<X size={20} />
					</button>

					{children}
				</div>
			</Overlay>
		</>
	);
};

export default Modal;
