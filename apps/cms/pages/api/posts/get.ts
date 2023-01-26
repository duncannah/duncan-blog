import { Prisma } from "@prisma/client";
import { prisma } from "@duncan-blog/shared/db";
import type { NextApiRequest, NextApiResponse } from "next";

export const PostsGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const where: Prisma.PostWhereInput = {};

	if (req.query[`createdAt-from`] && typeof req.query[`createdAt-from`] === `string`) where.createdAt = { gte: new Date(req.query[`createdAt-from`]) };
	if (req.query[`createdAt-to`] && typeof req.query[`createdAt-to`] === `string`) where.createdAt = { lte: new Date(req.query[`createdAt-to`]) };

	if (req.query[`updatedAt-from`] && typeof req.query[`updatedAt-from`] === `string`) where.updatedAt = { gte: new Date(req.query[`updatedAt-from`]) };
	if (req.query[`updatedAt-to`] && typeof req.query[`updatedAt-to`] === `string`) where.updatedAt = { lte: new Date(req.query[`updatedAt-to`]) };

	if (req.query[`slug`] && typeof req.query[`slug`] === `string`) where.slug = { contains: req.query[`slug`] };

	if (req.query[`title`] && typeof req.query[`title`] === `string`) where.title = { contains: req.query[`title`] };

	if (req.query[`content`] && typeof req.query[`content`] === `string`) where.content = { contains: req.query[`content`] };

	if (req.query[`published`] && typeof req.query[`published`] === `string`) where.published = req.query[`published`] == `1`;

	if (req.query[`isPage`] && typeof req.query[`isPage`] === `string`) where.isPage = req.query[`isPage`] == `1`;

	const posts = await prisma.post.findMany({
		where,
		include: {
			categories: true,
		},
		orderBy: {
			updatedAt: `desc`,
		},
	});

	for (const post of posts) {
		post.content = ``;
	}

	res.status(200).json({ data: posts });
};

export default PostsGetHandler;
