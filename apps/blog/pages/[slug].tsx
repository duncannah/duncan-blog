import { Post, Upload, Category } from "@prisma/client";
import { prisma } from "@duncan-blog/shared";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import HTMLParser, { Element, DOMNode, Text, domToReact } from "html-react-parser";
import { dateToString } from "../shared/utils";
import Prism from "prismjs";

import styles from "./[slug].module.scss";
import Head from "next/head";
import Link from "next/link";

const HTMLElementReplacer = (domNode: DOMNode) => {
	if (domNode instanceof Element)
		switch (domNode.tagName) {
			case `pre`:
				if (domNode.attribs.class?.startsWith(`language-`)) {
					const code = ((domNode?.children[0] as Element)?.children[0] as Text)?.data;
					const language = domNode.attribs.class.split(`-`)[1];

					return (
						<pre className={domNode.attribs.class}>
							<code>{HTMLParser(Prism.highlight(code, Prism.languages[language] || `plain`, language))}</code>
						</pre>
					);
				}
				break;

			case `a`:
				return (
					<Link href={domNode.attribs.href} target={domNode.attribs.target === `_blank` || !domNode.attribs.href.startsWith(`/`) ? `_blank` : undefined}>
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
}> = ({ post }) => {
	return (
		post && (
			<>
				<Head>
					<title>{`${post.title} - ${process.env.NEXT_PUBLIC_BLOG_FULLNAME || ``}`}</title>
				</Head>
				<section className={styles.page} lang={post.language}>
					{!post.isPage && (
						<div className={styles.head}>
							<div className={styles.titleAndImage}>
								<h2>{post.title}</h2>
								{post.mainImage && (
									<>
										<img src={post.mainImage.url || ``} alt={``} />
									</>
								)}
							</div>
							<div className={styles.info}>
								<div className={styles.time}>
									<strong>{dateToString(post.createdAt)}</strong>
									{post.createdAt !== post.updatedAt && (
										<span>
											{`updated `}
											<strong>{dateToString(post.createdAt)}</strong>
										</span>
									)}
								</div>
								<ul className={styles.categories}>
									{post.categories.map((category) => (
										<li key={category.name}>
											<a href={`/categories/${category.name}`}>{`${category.name}`}</a>
										</li>
									))}
								</ul>
							</div>
						</div>
					)}

					<div className={styles.content}>{HTMLParser(post.content, { replace: HTMLElementReplacer })}</div>
				</section>
			</>
		)
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

	return {
		props: JSON.parse(JSON.stringify({ post })) as Jsonify<typeof post>,
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const postPaths = await prisma.post.findMany({
		select: {
			slug: true,
		},
		where: {
			published: true,
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
