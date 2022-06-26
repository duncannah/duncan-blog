import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";
import { createReadStream } from "fs";
import { pipeline } from "stream";

export const UploadsPreviewHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const upload = await prisma.upload.findFirst({
		where: {
			id: req.query[`id`][0].toString(),
		},
	});

	res.setHeader(`Content-Type`, upload?.mimetype || `application/octet-stream`);
	const imageStream = createReadStream(`${process.env[`UPLOADS_PATH`] || ``}/${upload?.id || ``}/${upload?.name || ``}`);
	pipeline(imageStream, res, (error) => {
		if (error) console.error(error);
	});
};

export default UploadsPreviewHandler;
