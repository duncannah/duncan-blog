import { settingsSchema, setSetting } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";
import triggerRebuild from "../../../util/rebuild";

const isObject = (input: unknown): input is Record<string, unknown> => typeof input === `object` && input !== null && !Array.isArray(input);

export const NavigationLinksPostHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (!isObject(req.body)) return res.status(400).json({});

	for (const [key, value] of Object.entries(req.body)) {
		const parsed = settingsSchema.safeParse({
			[key]: value,
		});

		if (!parsed.success || !(key in parsed.data)) continue;

		await setSetting(key as keyof typeof parsed.data, parsed.data[key as keyof typeof parsed.data]);
	}

	void triggerRebuild();

	res.status(200).json({ success: true });
};

export default NavigationLinksPostHandler;
