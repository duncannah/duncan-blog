import Link from "next/link";
import { useEffect, useState } from "react";
import { APICall } from "../util/fetch";

export function Index() {
	const [lastRebuild, setLastRebuild] = useState<string | null>(`Loading...`);

	function getStatus() {
		setLastRebuild(`Loading...`);

		APICall.get<string>(`status`)
			.then((res) => setLastRebuild(res))
			.catch((err) => console.error(err));
	}

	useEffect(getStatus, []);

	return (
		<div>
			<h2>{`Navigation`}</h2>
			<ul>
				<li>
					<Link href={`/edit-post`}>{`Create or edit a post`}</Link>
				</li>
				<li>
					<Link href={`/manage-website`}>{`Manage website`}</Link>
				</li>
			</ul>
			<div className={`hstack`}>
				<h2>{`Status`}</h2>
				<a onClick={getStatus}>{`Refresh`}</a>
			</div>
			<div>
				<pre className={`language-txt`}>
					<code>
						{`Last rebuild: `}
						<strong>{lastRebuild ?? `[no rebuilds recently]`}</strong>
					</code>
				</pre>
			</div>
		</div>
	);
}

export default Index;
