import { Category, Post, Upload } from "@prisma/client";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback } from "react";

import { Pagination, prisma } from "@duncan-blog/shared";
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
	}>
> = ({ category, count, currentPage, totalPages }) => {
	const router = useRouter();

	const navigateToPage = useCallback(
		(page: number) => void (page === 1 ? router.push(`/categories/${category.name}`) : router.push(`/categories/${category.name}/page/${page}`)),
		[category.name, router],
	);

	return (
		<>
			<h2 style={{ margin: 0 }}>{`#${category.name} (${count} post${count !== 1 ? `s` : ``})`}</h2>
			<PostList posts={category.posts} />
			<Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={navigateToPage} hideIfSinglePage={true} />
		</>
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
		include: { posts: { include: { mainImage: true, categories: true }, skip: (currentPage - 1) * 12, take: POSTS_PER_PAGE } },
	});

	return {
		props: JSON.parse(JSON.stringify({ category, count, currentPage, totalPages })) as Record<string, unknown>,
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
