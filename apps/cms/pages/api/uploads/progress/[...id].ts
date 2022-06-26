import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";

export const UploadsProgressHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const progress = await prisma.upload.findFirst({
		select: {
			processingProgress: true,
		},
		where: {
			id: req.query[`id`][0].toString(),
		},
	});

	res.status(200).json({ data: progress?.processingProgress });
};

export default UploadsProgressHandler;
