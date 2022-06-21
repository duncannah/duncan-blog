import type { NextApiRequest, NextApiResponse } from "next";

import CategoriesGetHandler from "./get";

export const CategoriesHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case `GET`:
			return CategoriesGetHandler(req, res);
		default:
			return res.status(405).json({
				error: `Method ${req.method || ``} not allowed`,
			});
	}
};

export default CategoriesHandler;
