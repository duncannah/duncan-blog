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

const MIMETYPE: Record<string, string> = {
	webm: `video/webm`,
	mp4: `video/mp4`,
	jpg: `image/jpeg`,
	png: `image/png`,
	webp: `image/webp`,
	gif: `image/gif`,
};

const UploadsPostHandler = async (req: FormNextApiRequest, res: NextApiResponse) => {
	const files: [EnhancedFile, FileUploadOptions][] = [];

	for (const [key, value] of Object.entries(req.fields)) {
		if (key.startsWith(`options-`)) {
			const i = parseInt(key.substring(`options-`.length), 10);
			files[i] = [req.files[i], JSON.parse(value) as FileUploadOptions];
		}
	}

	await Promise.all(
		files.map(async ([file, options]) => {
			const id = cuid();
			const finalDir = `${process.env[`UPLOADS_PATH`] || ``}/${id}`;
			let finalPath = `${finalDir}/${file.originalFilename || `file`}`;
			let finalMime = file.mimetype || `application/octet-stream`;

			const replaceType = (ext: string) => {
				finalPath = finalPath.replace(/(?<=[^/]+)\..*$/, `.${ext}`);
				finalMime = MIMETYPE[ext] || `application/octet-stream`;
			};

			let manualCleanup = false;

			try {
				await fs.promises.mkdir(finalDir, { recursive: true });

				if (options.convertTo || options.toStripMetaData) {
					if (file.mimetype?.startsWith(`image/`)) {
						let image = sharp(file.filepath, { animated: true });

						if (!options.toStripMetaData) {
							image = image.withMetadata();
						}

						if (options.resizeTo) {
							image = image.resize({ height: parseInt(options.resizeTo, 10) });
						}

						if (options.convertTo) {
							replaceType(options.convertTo);
							image = image.toFormat(options.convertTo as keyof FormatEnum);
						}

						await image.toFile(finalPath);
					} else if (file.mimetype?.startsWith(`video/`)) {
						manualCleanup = true;
						// cleanupFiles doesn't work so WORKAROUND
						// TODO: remove this when fixed
						await fs.promises.copyFile(file.filepath, file.filepath + `.tmp`);

						let cmd = ffmpeg({
							source: file.filepath + `.tmp`,
						}).outputOptions([`-loop 0`]);

						if (options.toStripMetaData) {
							cmd = cmd.outputOptions([`-map_metadata -1`]);
						}

						if (!options.resizeTo && !options.convertTo) {
							cmd = cmd.videoCodec(`copy`);
						} else {
							if (options.resizeTo) {
								cmd = cmd.size(`?x${parseInt(options.resizeTo, 10)}`);
							}

							if (options.convertTo) {
								replaceType(options.convertTo);
							}
						}

						new Promise((resolve, reject) => {
							// Record progress only if 5 seconds has elapsed
							let lastRecorded = Date.now();

							cmd.on(`progress`, function (progress: { percent: number }) {
								if (Date.now() - lastRecorded > 5000) {
									lastRecorded = Date.now();

									prisma.upload
										.update({
											where: { id },
											data: {
												processingProgress: `${progress.percent.toFixed(2)}%`,
											},
										})
										.catch(() => {
											// this means the upload has been deleted
											cmd.kill(`SIGKILL`);
											reject(`Upload has been deleted`);
										});
								}
							})
								.on(`error`, reject)
								.on(`end`, resolve)
								.save(finalPath);
						})
							.then(async () =>
								prisma.upload
									.update({
										where: { id },
										data: {
											processingProgress: `DONE`,
											size: (await fs.promises.stat(finalPath).catch(() => ({ size: 0 }))).size,
										},
									})
									.catch(() => null),
							)
							.catch((err) => {
								console.error(err);

								prisma.upload
									.update({
										where: { id },
										data: {
											processingProgress: `FAIL`,
										},
									})
									.catch(() => null);
							})
							// TODO: update when cleanupFiles is fixed
							.finally(() => void fs.promises.unlink(file.filepath + `.tmp`));
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
						size: (await fs.promises.stat(finalPath).catch(() => ({ size: 0 }))).size,
						postId: req.fields.postId,
						processingProgress: manualCleanup ? `0%` : undefined,
					},
				});
			} catch (e) {
				console.error(e);
			} finally {
				if (!manualCleanup) await fs.promises.unlink(file.filepath);
			}
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

// TODO: cleanupFiles to be changed to false after it's fixed
export default withFileUpload(UploadsPostHandler, { cleanupFiles: true });

export const config = getConfig();
