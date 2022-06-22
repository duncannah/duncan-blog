import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";

export const PostsDeleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const body = req.body as Jsonify<{ slug: string }>;

	await prisma.post.delete({
		where: {
			slug: body.slug,
		},
	});

	// TODO: trigger static page rebuild

	res.status(200).json({ success: true });
};

export default PostsDeleteHandler;
