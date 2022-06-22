import { Post, Category, Upload } from "@prisma/client";
import { Pagination, prisma } from "@duncan-blog/shared";
import { useCallback } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

import { POSTS_PER_PAGE } from "../shared/utils";
import { PostList } from "../components/PostList";

export function Index({
	posts,
	currentPage,
	totalPages,
}: Jsonify<{
	posts: (Post & {
		mainImage: Upload;
		categories: Category[];
	})[];
	currentPage: number;
	totalPages: number;
}>) {
	const router = useRouter();

	const navigateToPage = useCallback((page: number) => void (page === 1 ? router.push(`/`) : router.push(`/page/${page}`)), [router]);

	return (
		<>
			<PostList posts={posts} />
			<Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={navigateToPage} hideIfSinglePage={true} />
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
		props: JSON.parse(JSON.stringify({ posts, currentPage, totalPages })) as Jsonify<typeof posts & { currentPage: number; totalPages: number }>,
	};
};

export default Index;
