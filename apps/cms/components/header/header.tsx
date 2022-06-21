import Link from "next/link";
import styles from "./header.module.scss";

/* eslint-disable-next-line */
export interface HeaderProps {}

export function Header(props: HeaderProps) {
	return (
		<div className={styles[`container`]}>
			<Link href={`/`}>
				<a>
					<h1>{`CMS 🤔`}</h1>
				</a>
			</Link>

			<a href={`https://ermansay.in`} target={`_blank`}>
				{`→ Website`}
			</a>
		</div>
	);
}

export default Header;
