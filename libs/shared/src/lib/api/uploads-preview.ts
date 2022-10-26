import { prisma } from "@duncan-blog/shared";
import type { NextApiRequest, NextApiResponse } from "next";
import { createReadStream } from "fs";
import { pipeline } from "stream";

export const UploadsPreviewHandler = async (req: NextApiRequest, res: NextApiResponse) => {
	const upload =
		req.query[`id`] &&
		(await prisma.upload.findFirst({
			where: {
				id: req.query[`id`][0].toString(),
			},
		}));

	if (!upload || (upload?.processingProgress && upload.processingProgress !== `DONE`)) {
		res.setHeader(`Content-Type`, `image/svg+xml`);

		return res.status(200).send(`<?xml version='1.2' encoding='UTF-8' standalone='no'?><svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150">
			<rect fill="hsl(0, 100%, 20%)" width="300" height="150" />
			<text
				fill="rgba(255,255,255,0.5)"
				font-family="sans-serif"
				font-size="30"
				dy="10.5"
				font-weight="bold"
				x="50%"
				y="50%"
				text-anchor="middle"
			>
				${!upload ? `not found` : `processing...`}
			</text>
		</svg>`);
	}

	res.setHeader(`Content-Type`, upload?.mimetype || `application/octet-stream`);
	const imageStream = createReadStream(`${process.env[`UPLOADS_PATH`] || ``}/${upload?.id || ``}/${upload?.name || ``}`);
	pipeline(imageStream, res, (error) => {
		if (error) console.error(error);
	});
};

export default UploadsPreviewHandler;
