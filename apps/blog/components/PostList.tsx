import { Post, Upload, Category } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";
import { dateToString } from "../shared/utils";

import styles from "./PostList.module.scss";

export const PostList: NextPage<{
	posts: Jsonify<
		(Post & {
			mainImage: Upload;
			categories: Category[];
		})[]
	>;
}> = ({ posts }) => {
	return (
		<ul className={styles.posts}>
			{posts.map((post) => (
				<li key={post.slug} className={styles.post}>
					<Link href={`/${post.slug}`}>
						<a>
							<img src={post.mainImage?.url || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'/%3E`} alt={``} />
							<div className={styles.info}>
								<h2>{post.title}</h2>
								<div className={styles.meta}>
									<div className={styles.time}>{dateToString(post.createdAt)}</div>
									<ul className={styles.categories}>
										{post.categories.map((category) => (
											<li key={category.name}>{category.name}</li>
										))}
									</ul>
								</div>
							</div>
						</a>
					</Link>
				</li>
			))}
		</ul>
	);
};
