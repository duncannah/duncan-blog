import { Category, Post, Upload } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";

import { prisma } from "@duncan-blog/shared/db";
import { Pagination } from "@duncan-blog/shared/lib/pagination/pagination";
import { PostList } from "../../../components/PostList";
import { POSTS_PER_PAGE } from "../../../shared/utils";

export const CategoryPage: NextPage<
	Jsonify<{
		category: Category & {
			posts: (Post & {
				mainImage: Upload;
				categories: Category[];
			})[];
		};
		count: number;
		currentPage: number;
		totalPages: number;
		UPLOADS_URL: string;
	}>
> = ({ category, count, currentPage, totalPages, UPLOADS_URL }) => {
	return (
		<div>
			<div>
				<h2 style={{ marginTop: 0 }}>{`#${category.name} (${count} post${count !== 1 ? `s` : ``})`}</h2>
				<PostList posts={category.posts} UPLOADS_URL={UPLOADS_URL} />
			</div>
			<Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/categories/${category.name}/`} hideIfSinglePage={true} />
		</div>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const where = {
		published: true,
		isPage: false,
		categories: { some: { name: context.params?.name?.toString() } },
	};

	const currentPage = parseInt(context.params?.page?.toString() || `1`, 10) || 1;
	const totalPages = Math.ceil((await prisma.post.count({ where })) / POSTS_PER_PAGE);

	const count = await prisma.post.count({
		where,
	});

	if (!count) return { notFound: true };

	const category = await prisma.category.findFirst({
		where: {
			name: context.params?.name?.toString(),
		},
		include: {
			posts: {
				include: { mainImage: true, categories: true },
				skip: (currentPage - 1) * 12,
				take: POSTS_PER_PAGE,
				where: {
					published: true,
					isPage: false,
				},
				orderBy: {
					createdAt: `desc`,
				},
			},
		},
	});

	if (category)
		for (const post of category.posts) {
			post.content = ``;
		}

	return {
		props: JSON.parse(JSON.stringify({ category, count, currentPage, totalPages, UPLOADS_URL: process.env[`UPLOADS_URL`] })) as Record<string, unknown>,
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
