import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";

export const CategoriesGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const categories = await prisma.category.findMany();

	res.status(200).json({ data: categories });
};

export default CategoriesGetHandler;
