import { useEffect, useRef } from "react";
import styles from "./modal.module.scss";

/* eslint-disable-next-line */
export interface ModalProps {
	close: () => unknown;
	children: React.ReactNode;
}

export function Modal({ close, children }: ModalProps) {
	const modalRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (modalRef.current) {
			if (!modalRef.current.open) modalRef.current.showModal();

			modalRef.current.addEventListener(`cancel`, (e) => {
				e.preventDefault();
			});
		}
	}, []);

	return (
		<dialog ref={modalRef} className={styles[`container`]}>
			{children}
			<a onClick={close}>{`Close`}</a>
		</dialog>
	);
}

export default Modal;
