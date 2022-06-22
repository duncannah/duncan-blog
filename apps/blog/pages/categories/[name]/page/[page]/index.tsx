import { GetStaticPaths } from "next";
import { POSTS_PER_PAGE } from "../../../../../shared/utils";
import Index, { getStaticProps } from "../..";
import { prisma } from "@duncan-blog/shared";

export { getStaticProps };

export const getStaticPaths: GetStaticPaths = async (context) => {
	// workaround for https://github.com/prisma/prisma/issues/9880
	const categories = await Promise.all(
		(
			await prisma.category.findMany()
		).map(async (c) => ({
			...c,
			postCount: await prisma.post.count({
				where: {
					published: true,
					isPage: false,
					categories: { some: { name: c.name } },
				},
			}),
		})),
	);

	const paths = [];
	for (const category of categories) {
		for (let i = 0; i < Math.ceil(category.postCount / POSTS_PER_PAGE); i++) {
			paths.push({
				params: {
					name: category.name,
					page: (i + 1).toString(),
				},
			});
		}
	}

	return {
		paths,
		fallback: false,
	};
};

export default Index;
