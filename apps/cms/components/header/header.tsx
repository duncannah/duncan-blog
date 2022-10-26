import Link from "next/link";
import styles from "./header.module.scss";

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
	return (
		<div className={styles[`container`]}>
			<Link href={`/`}>
				<h1>{`CMS 🤔`}</h1>
			</Link>
		</div>
	);
}

export default Header;
