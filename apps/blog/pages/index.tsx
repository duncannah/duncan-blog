import { Post, Category, Upload } from "@prisma/client";
import { prisma } from "@duncan-blog/shared";
import { PostList } from "../components/PostList";

import styles from "./index.module.scss";

export function Index({
	posts,
}: {
	posts: Jsonify<
		(Post & {
			mainImage: Upload;
			categories: Category[];
		})[]
	>;
}) {
	return (
		<div className={styles.page}>
			<PostList posts={posts} />
		</div>
	);
}

export async function getStaticProps() {
	// TODO: pagination

	const posts = await prisma.post.findMany({
		where: {
			published: true,
			isPage: false,
		},
		include: {
			mainImage: true,
			categories: true,
		},
	});

	return {
		props: JSON.parse(JSON.stringify({ posts })) as Jsonify<typeof posts>,
	};
}

export default Index;
