import Link from "next/link";
import styles from "./index.module.scss";

export function Index() {
	return (
		<div className={styles.page}>
			<ul>
				<li>
					<Link href={`/edit-post`}>{`Create or edit a post`}</Link>
				</li>
				<li>
					<Link href={`/manage-website`}>{`Manage website`}</Link>
				</li>
			</ul>
		</div>
	);
}

export default Index;
