import { prisma } from "@duncan-blog/shared";
import type { NextApiResponse } from "next";
import { FormNextApiRequest, withFileUpload, getConfig } from "next-multipart";
import { EnhancedFile } from "next-multipart/dist/lib/helpers";
import sharp, { FormatEnum } from "sharp";
import ffmpeg from "fluent-ffmpeg";
import cuid from "cuid";
import fs from "fs";
import path from "path";

export type FileUploadOptions = {
	toStripMetaData?: boolean;
	convertTo?: string | null;
	resizeTo?: string | null;
};

export const UploadsPostHandler = async (req: FormNextApiRequest, res: NextApiResponse) => {
	const files: [EnhancedFile, FileUploadOptions][] = [];

	for (const [key, value] of Object.entries(req.fields)) {
		if (key.startsWith(`options-`)) {
			const i = parseInt(key.substring(`options-`.length), 10);
			files[i] = [req.files[i], JSON.parse(value) as FileUploadOptions];
		}
	}

	// notes:
	// for ffmpeg: -map_metadata -1 -map_chapters -1 -map_attachments -1

	await Promise.all(
		files.map(async ([file, options]) => {
			const id = cuid();
			const finalDir = `${process.env[`UPLOADS_PATH`] || ``}/${id}`;
			let finalPath = `${finalDir}/${file.originalFilename || `file`}`;
			let finalMime = file.mimetype || `application/octet-stream`;

			await fs.promises.mkdir(finalDir, { recursive: true });

			if (options.convertTo || options.toStripMetaData) {
				if (file.mimetype?.startsWith(`image/`)) {
					let image = sharp(file.filepath);

					if (!options.toStripMetaData) {
						image = image.withMetadata();
					}

					if (options.resizeTo) {
						image = image.resize({ height: parseInt(options.resizeTo, 10) });
					}

					if (options.convertTo) {
						finalPath = `${finalDir}/${file.originalFilename || `file`}.${options.convertTo}`;
						finalMime = `image/${options.convertTo}`;
						image = image.toFormat(options.convertTo as keyof FormatEnum);
					}

					await image.toFile(finalPath);
				} else if (file.mimetype?.startsWith(`video/`)) {
					let cmd = ffmpeg({
						source: file.filepath,
					});

					if (options.toStripMetaData) {
						cmd = cmd.outputOptions([`-map_metadata -1`]);
					}

					if (options.resizeTo) {
						cmd = cmd.size(`?x${parseInt(options.resizeTo, 10)}`);
					} else cmd = cmd.videoCodec(`copy`);

					if (options.convertTo) {
						finalPath = `${finalDir}/${file.originalFilename || `file`}.${options.convertTo}`;
						finalMime = `video/${options.convertTo}`;
					}

					await new Promise((resolve, reject) => {
						cmd.on(`error`, reject).on(`end`, resolve).save(finalPath);
					});
				} else {
					// copy file over to final path
					await fs.promises.copyFile(file.filepath, finalPath);
				}
			} else {
				// copy file over to final path
				await fs.promises.copyFile(file.filepath, finalPath);
			}

			return prisma.upload.create({
				data: {
					id,
					name: path.basename(finalPath),
					mimetype: finalMime,
					size: (await fs.promises.stat(finalPath)).size,
					postId: req.fields.postId,
				},
			});
		}),
	);

	res.status(200).json({
		success: true,
		data: await prisma.upload.findMany({
			where: {
				postId: req.fields.postId,
			},
		}),
	});
};

export default withFileUpload(UploadsPostHandler);

export const config = getConfig();
