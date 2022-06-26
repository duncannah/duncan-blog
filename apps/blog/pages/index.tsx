import { Post, Category, Upload } from "@prisma/client";
import { Pagination, prisma } from "@duncan-blog/shared";
import { GetStaticProps } from "next";

import { POSTS_PER_PAGE } from "../shared/utils";
import { PostList } from "../components/PostList";

export function Index({
	posts,
	currentPage,
	totalPages,
	UPLOADS_URL,
}: Jsonify<{
	posts: (Post & {
		mainImage: Upload;
		categories: Category[];
	})[];
	currentPage: number;
	totalPages: number;
	UPLOADS_URL: string;
}>) {
	return (
		<>
			<PostList posts={posts} UPLOADS_URL={UPLOADS_URL} />
			<Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/`} hideIfSinglePage={true} />
		</>
	);
}

export const getStaticProps: GetStaticProps = async (context) => {
	const where = {
		published: true,
		isPage: false,
	};

	const currentPage = parseInt(context.params?.page?.toString() || `1`, 10) || 1;
	const totalPages = Math.ceil((await prisma.post.count({ where })) / POSTS_PER_PAGE);

	const posts = await prisma.post.findMany({
		where,
		include: {
			mainImage: true,
			categories: true,
		},
		skip: (currentPage - 1) * 12,
		take: POSTS_PER_PAGE,
	});

	return {
		props: JSON.parse(JSON.stringify({ posts, currentPage, totalPages, UPLOADS_URL: process.env[`UPLOADS_URL`] })) as Jsonify<
			typeof posts & { currentPage: number; totalPages: number }
		>,
	};
};

export default Index;
