import { Post, Upload, Category } from "@prisma/client";
import { getSetting, prisma, md } from "@duncan-blog/shared";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import HTMLParser, { Element, DOMNode, domToReact } from "html-react-parser";
import { dateToString, getUploadURL } from "../../shared/utils";

import styles from "./[slug].module.scss";
import Head from "next/head";
import Link from "next/link";

const HTMLElementReplacer = (domNode: DOMNode) => {
	if (domNode instanceof Element)
		switch (domNode.tagName) {
			case `a`:
				return (
					<Link href={domNode.attribs.href} target={domNode.attribs.target === `_blank` || !domNode.attribs.href.startsWith(`/`) ? `_blank` : undefined} legacyBehavior>
						{domToReact([domNode])}
					</Link>
				);
			default:
				break;
		}
};

export const PostPage: NextPage<{
	post: Jsonify<
		Post & {
			mainImage: Upload;
			categories: Category[];
		}
	>;
	blogFullName: string;
	UPLOADS_URL: string;
}> = ({ post, blogFullName, UPLOADS_URL }) => {
	if (!post) return null;

	const { title, content, mainImage, categories, language, isPage } = post;

	const createdAtHuman = dateToString(post.createdAt);
	const updatedAtHuman = dateToString(post.updatedAt);

	return (
		<>
			<Head>
				<title>{`${title} - ${blogFullName}`}</title>
			</Head>
			<section className={styles.page} lang={language}>
				{!isPage && (
					<div className={styles.head}>
						<div className={styles.titleAndImage}>
							<h2>{title}</h2>
							{mainImage && (
								<>
									<img src={mainImage?.url || getUploadURL(mainImage.id, post.mainImage.name, UPLOADS_URL)} alt={``} />
								</>
							)}
						</div>
						<div className={styles.info}>
							<div className={styles.time}>
								<strong>{createdAtHuman}</strong>
								{createdAtHuman !== updatedAtHuman && (
									<span>
										{`updated `}
										<strong>{updatedAtHuman}</strong>
									</span>
								)}
							</div>
							<ul className={styles.categories}>
								{categories.map((category) => (
									<li key={category.name}>
										<Link href={`/categories/${category.name}`}>{`${category.name}`}</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				<div className={styles.content}>{HTMLParser(content, { replace: HTMLElementReplacer })}</div>
			</section>
		</>
	);
};

export const getStaticProps: GetStaticProps = async (context) => {
	const post = await prisma.post.findFirst({
		where: {
			slug: (context.params?.slug || ``).toString(),
		},
		include: {
			// uploads: true,
			mainImage: true,
			categories: true,
		},
	});

	if (!post) return { notFound: true };

	post.content = md.render(post.content);

	if (process.env[`NODE_ENV`] !== `development`) post.content = post.content.replace(/(?:\.\.|)\/api\/uploads\/preview\//gm, `${process.env[`UPLOADS_URL`] || ``}/`);

	const blogFullName = await getSetting(`blogFullName`);

	return {
		props: JSON.parse(JSON.stringify({ post, blogFullName, UPLOADS_URL: process.env[`UPLOADS_URL`] })) as Record<string, unknown>,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const postPaths = await prisma.post.findMany({
		select: {
			slug: true,
		},
		where: {
			published: true,
			isPage: false,
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

export default PostPage;
