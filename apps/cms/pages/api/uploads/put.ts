import { prisma } from "@duncan-blog/shared/db";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export const UploadsPutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const body = req.body as Jsonify<{ id: string; name: string }>;

	if (body.name.match(/[/]/)) {
		return res.status(400).json({
			error: `Invalid name`,
		});
	}

	const upload = await prisma.upload.findFirst({
		where: {
			id: body.id,
		},
	});

	if (!upload) {
		return res.status(404).json({
			error: `File not found`,
		});
	}

	await fs.promises.rename(`${process.env[`UPLOADS_PATH`] || `AAA`}/${upload.id}/${upload.name}`, `${process.env[`UPLOADS_PATH`] || `AAA`}/${upload.id}/${body.name}`);

	await prisma.upload.update({
		where: {
			id: body.id,
		},
		data: {
			name: body.name,
		},
	});

	res.status(200).json({ success: true });
};

export default UploadsPutHandler;
