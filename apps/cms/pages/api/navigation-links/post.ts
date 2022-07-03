import { prisma } from "@duncan-blog/shared";
import { HeaderLink } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import triggerRebuild from "../../../util/rebuild";

export const NavigationLinksPostHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const body = req.body as Jsonify<HeaderLink[]>;

	await prisma.headerLink.deleteMany({});

	for (const link of body) {
		await prisma.headerLink.create({
			data: link,
		});
	}

	void triggerRebuild();

	res.status(200).json({ success: true });
};

export default NavigationLinksPostHandler;
