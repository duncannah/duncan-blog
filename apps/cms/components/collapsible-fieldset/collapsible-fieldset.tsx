import { useState } from "react";

import styles from "./collapsible-fieldset.module.scss";

export interface CollapsibleFieldsetProps {
	legend: string;
	children: React.ReactNode;
}

export function CollapsibleFieldset(props: CollapsibleFieldsetProps & React.HTMLAttributes<HTMLFieldSetElement>) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<fieldset {...props} className={`${styles[`container`]} ${props.className || ``}`}>
			<legend onClick={toggleOpen}>{`${isOpen ? `▲` : `▼`} ${props.legend}`}</legend>
			<div className={isOpen ? `` : styles[`hidden`]}>{props.children}</div>
		</fieldset>
	);
}

export default CollapsibleFieldset;
