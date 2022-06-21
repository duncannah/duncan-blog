import type { NextApiRequest, NextApiResponse } from "next";

import NavigationLinksGetHandler from "./get";
import NavigationLinksPostHandler from "./post";

export const NavigationLinksHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case `GET`:
			return NavigationLinksGetHandler(req, res);
		case `POST`:
			return NavigationLinksPostHandler(req, res);
		// case `DELETE`:
		// return PostsDeleteHandler(req, res);
		default:
			return res.status(405).json({
				error: `Method ${req.method || ``} not allowed`,
			});
	}
};

export default NavigationLinksHandler;
