import { Category, Post } from "@prisma/client";
import { prisma } from "@duncan-blog/shared/db";
import type { NextApiRequest, NextApiResponse } from "next";
import triggerRebuild from "../../../util/rebuild";

export const PostsPostHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const body = req.body as Jsonify<{ values: Partial<Post & { categories: Category[] }>; oldValues: Partial<Post> }>;
	const { values, oldValues } = body;

	// create entries for new categories
	if (values.categories)
		await Promise.all(
			values.categories.map(async (category) => {
				if (!(await prisma.category.findFirst({ where: category }))) {
					await prisma.category.create({
						data: category,
					});
				}
			}),
		);

	// use oldValues for where clause
	const post = await prisma.post.update({
		data: {
			slug: values.slug,
			title: values.title,
			content: values.content,
			createdAt: oldValues.slug?.match(/^[0-9]+-new$/) ? new Date() : undefined,
			updatedAt: new Date(),
			published: values.published,
			isPage: values.isPage,
			mainImageId: values.mainImageId,
			categories: {
				set: (values.categories || []).map(({ name }) => {
					return {
						name,
					};
				}),
			},
		},
		where: {
			slug: oldValues.slug,
		},
	});

	void triggerRebuild();

	res.status(200).json({ success: true, data: post });
};

export default PostsPostHandler;
