import { POSTS_PER_PAGE } from "../../../shared/utils";
import { prisma } from "@duncan-blog/shared";
import Index, { getStaticProps } from "../..";

export { getStaticProps };

export const getStaticPaths = async () => {
	const postCount = await prisma.post.count({
		where: {
			published: true,
			isPage: false,
		},
	});

	const paths = [];
	for (let i = 0; i < Math.ceil(postCount / POSTS_PER_PAGE); i++) {
		paths.push({
			params: {
				page: (i + 1).toString(),
			},
		});
	}

	return {
		paths,
		fallback: false,
	};
};

export default Index;
