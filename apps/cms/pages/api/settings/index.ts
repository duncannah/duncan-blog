import type { NextApiRequest, NextApiResponse } from "next";

import SettingsGetHandler from "./get";
import SettingsPostHandler from "./post";

export const SettingsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case `GET`:
			return SettingsGetHandler(req, res);
		case `POST`:
			return SettingsPostHandler(req, res);
		default:
			return res.status(405).json({
				error: `Method ${req.method || ``} not allowed`,
			});
	}
};

export default SettingsHandler;
