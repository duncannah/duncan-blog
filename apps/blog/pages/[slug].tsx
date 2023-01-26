// Posts that are pages handler
import { GetStaticPaths } from "next";
import { prisma } from "@duncan-blog/shared/db";
import { PostPage, getStaticProps } from "./post/[slug]";

export default PostPage;

export const getStaticPaths: GetStaticPaths = async () => {
	const postPaths = await prisma.post.findMany({
		select: {
			slug: true,
		},
		where: {
			published: true,
			isPage: true,
		},
	});

	return {
		paths: postPaths.map((post) => ({
			params: {
				slug: post.slug,
			},
		})),

		fallback: true,
	};
};

export { getStaticProps };
