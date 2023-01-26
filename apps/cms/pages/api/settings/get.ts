import { getSettings } from "@duncan-blog/shared/settings";
import type { NextApiRequest, NextApiResponse } from "next";

export const SettingsGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const Settings = await getSettings();

	res.status(200).json({ data: Settings });
};

export default SettingsGetHandler;
