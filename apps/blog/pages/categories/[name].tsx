import { Category, Post, PrismaClient, Upload } from "@prisma/client";
import { PostList } from "../../components/PostList";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

const prisma = new PrismaClient();

export const CategoryPage: NextPage<{
	category: Jsonify<
		Category & {
			posts: (Post & {
				mainImage: Upload;
				categories: Category[];
			})[];
		}
	>;
	count: number;
}> = ({ category, count }) => {
	return (
		<>
			<h2 style={{ margin: 0 }}>{`#${category.name} (${count} post${count !== 1 ? `s` : ``})`}</h2>
			<PostList posts={category.posts} />
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const count = await prisma.post.count({ where: { categories: { some: { name: context.params?.name?.toString() } } } });

	if (!count) return { notFound: true };

	const category = await prisma.category.findFirst({
		where: {
			name: context.params?.name?.toString(),
		},
		include: { posts: { include: { mainImage: true, categories: true } } },
	});

	return {
		props: JSON.parse(JSON.stringify({ category, count })) as Jsonify<typeof category & { count: number }>,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const categories = await prisma.category.findMany();

	const paths = categories.map((category) => ({
		params: { name: category.name },
	}));
	return { paths, fallback: false };
};

export default CategoryPage;
