import { lastRebuild } from "../../../util/rebuild";
import { NextApiRequest, NextApiResponse } from "next";

export const StatusHandler = (req: NextApiRequest, res: NextApiResponse) => {
	return res.json({ data: lastRebuild });
};

export default StatusHandler;
