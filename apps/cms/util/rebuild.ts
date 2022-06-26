import { exec } from "child_process";

export const triggerRebuild = async (): Promise<void> => {
	if (!process.env[`REBUILD_PATH`]) throw new Error(`REBUILD_PATH is not set`);

	if (process.env[`NODE_ENV`] === `development`) return;

	return new Promise((resolve, reject) => {
		exec(`pnpm nx export`, { cwd: process.env[`REBUILD_PATH`] }, (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				return reject(error);
			}

			return resolve();
		});
	});
};

export default triggerRebuild;
