import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import HTMLParser from "html-react-parser";
import React from "react";
import { Settings } from "@duncan-blog/shared";

import styles from "./Header.module.scss";

export const Header: NextPage<{ links: Jsonify<Settings["headerLinks"]> }> = ({ links }) => {
	const router = useRouter();

	return (
		<header className={styles.Header}>
			<Link href={`/`}>
				<h1>{process.env.NEXT_PUBLIC_BLOG_NAME}</h1>
			</Link>
			<ul>
				{links &&
					links.map((link) => (
						<li key={link.name} className={router.asPath === link.url ? styles.active : ``}>
							{link.url.match(/^https?:\/\//) ? (
								<a href={link.url} target={`_blank`} title={link.name}>
									{link.icon ? HTMLParser(link.icon) : link.name}
								</a>
							) : (
								<Link href={link.url} title={link.name}>
									{link.icon ? HTMLParser(link.icon) : link.name}
								</Link>
							)}
						</li>
					))}
			</ul>
		</header>
	);
};

export default Header;
