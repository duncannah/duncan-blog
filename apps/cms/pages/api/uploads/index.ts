import type { NextApiRequest, NextApiResponse } from "next";

// import UploadsPostHandler from "./post";
import UploadsDeleteHandler from "./delete";

export const PostsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		// POST is handled directly
		case `DELETE`:
			return UploadsDeleteHandler(req, res);
		default:
			return res.status(405).json({
				error: `Method ${req.method || ``} not allowed`,
			});
	}
};

export default PostsHandler;
