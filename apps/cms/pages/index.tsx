import Link from "next/link";
import { useEffect, useState } from "react";
import APICall from "../util/fetch";

import styles from "./index.module.scss";

export function Index() {
	const [lastRebuild, setLastRebuild] = useState<string | null>(`Loading...`);

	function getStatus() {
		setLastRebuild(`Loading...`);

		APICall<string>(`status`)
			.then((res) => setLastRebuild(res))
			.catch((err) => console.error(err));
	}

	useEffect(getStatus, []);

	return (
		<div className={styles.page}>
			<h2>{`Navigation`}</h2>
			<ul>
				<li>
					<Link href={`/edit-post`}>{`Create or edit a post`}</Link>
				</li>
				<li>
					<Link href={`/manage-website`}>{`Manage website`}</Link>
				</li>
			</ul>
			<p className={`hstack`}>
				<h2>{`Status`}</h2>
				<a onClick={getStatus}>{`Refresh`}</a>
			</p>
			<p>
				<pre className={`language-txt`}>
					<code>
						{`Last rebuild: `}
						<strong>{lastRebuild ?? `[no rebuilds recently]`}</strong>
					</code>
				</pre>
			</p>
		</div>
	);
}

export default Index;
