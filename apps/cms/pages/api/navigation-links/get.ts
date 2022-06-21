import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";

export const NavigationLinksGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const navigationLinks = await prisma.headerLink.findMany();

	res.status(200).json({ data: navigationLinks });
};

export default NavigationLinksGetHandler;
