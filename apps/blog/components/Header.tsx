import { HeaderLink } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import HTMLParser from "html-react-parser";
import React from "react";

import styles from "./Header.module.scss";

export const Header: NextPage<{ links: Jsonify<HeaderLink[]> }> = ({ links }) => {
	const router = useRouter();

	return (
		<header className={styles.Header}>
			<Link href={`/`}>
				<h1>{`ermansay.in`}</h1>
			</Link>
			<ul>
				{links &&
					links.map((link) => (
						<li key={link.name} className={router.asPath === link.url ? styles.active : ``}>
							<Link href={link.url}>
								<a>{link.icon ? HTMLParser(link.icon) : link.name}</a>
							</Link>
						</li>
					))}
			</ul>
		</header>
	);
};

export default Header;
