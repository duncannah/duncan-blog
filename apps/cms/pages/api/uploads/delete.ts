import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export const UploadsDeleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const body = req.body as Jsonify<{ id: string }>;

	await prisma.upload.delete({
		where: {
			id: body.id,
		},
	});

	await fs.promises.rm(`${process.env[`UPLOADS_PATH`] || `AAA`}/${body.id}`, { recursive: true });

	res.status(200).json({ success: true });
};

export default UploadsDeleteHandler;
