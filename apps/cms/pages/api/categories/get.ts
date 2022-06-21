import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export const CategoriesGetHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const categories = await prisma.category.findMany();

	res.status(200).json({ data: categories });
};

export default CategoriesGetHandler;
