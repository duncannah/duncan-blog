import { GetServerSideProps } from "next";
import Link from "next/link";
import { lastRebuild } from "../util/rebuild";

import styles from "./index.module.scss";

export function Index({ lastRebuild }: { lastRebuild: string | null }) {
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
			<h2>{`Status`}</h2>
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

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async () => {
	return {
		props: {
			lastRebuild: lastRebuild,
		},
	};
};

export default Index;
