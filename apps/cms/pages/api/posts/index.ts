import type { NextApiRequest, NextApiResponse } from "next";

import PostsGetHandler from "./get";
import PostsPostHandler from "./post";

export const PostsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case `GET`:
			return PostsGetHandler(req, res);
		case `POST`:
			return PostsPostHandler(req, res);
		// case `DELETE`:
		// return PostsDeleteHandler(req, res);
		default:
			return res.status(405).json({
				error: `Method ${req.method || ``} not allowed`,
			});
	}
};

export default PostsHandler;
